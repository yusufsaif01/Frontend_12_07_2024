import { Component, OnInit, OnDestroy } from '@angular/core';
import { environment } from '@env/environment';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { PanelOptions } from '@app/shared/models/panel-options.model';
import { GallerySingleService } from './gallery-single.service';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { untilDestroyed } from '@app/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { wordCount } from '@app/shared/validators/wordCount';
import { DeleteConfirmationComponent } from '@app/shared/dialog-box/delete-confirmation/delete-confirmation.component';

interface PostContext {
  id: string;
  post: {
    text: string;
    media_url: string;
    media_type: string;
  };
  posted_by: {
    avatar: string;
    member_type: string;
    user_id: string;
    name: string;
    type: string;
    position: string;
  };
  is_liked: boolean;
  likes: number;
  comments: {
    total: number;
    data: {
      comment: string;
      commented_by: {
        avatar: string;
        member_type: string;
        user_id: string;
        name: string;
        type: string;
        position: string;
      };
      commented_at: string;
    }[];
  };
  created_at: string;
  show_comment_box?: boolean;
  commentListing?: CommentContext[];
  commentForm?: FormGroup;
  commentPageNo?: number;
  commentPageSize?: number;
  addComment$?: Observable<any>;
  like$?: Observable<any>;
}

interface CommentContext {
  comment: string;
  commented_by: {
    avatar: string;
    member_type: string;
    user_id: string;
    name: string;
    type: string;
    position: string;
  };
  commented_at: string;
}
@Component({
  selector: 'app-gallery-single',
  templateUrl: './gallery-single.component.html',
  styleUrls: ['./gallery-single.component.scss']
})
export class GallerySingleComponent implements OnInit, OnDestroy {
  constructor(
    private _gallerySingleService: GallerySingleService,
    private _toastrService: ToastrService,
    private _formBuilder: FormBuilder,
    private dialog: MatDialog,
    private _activatedRoute: ActivatedRoute
  ) {
    this._activatedRoute.params.subscribe(param => {
      if (param.video_id) {
        this.videoId = param.video_id;
        this.getVideo();
      }
    });
  }

  avatar_url: string = '';
  videoId: string;
  environment = environment;
  postListing: PostContext[] = [];
  pageNo: number = 1;
  pageSize: number = 5;
  panelOptions: Partial<PanelOptions> = {
    bio: true,
    member_type: true,
    my_achievements: true,
    view_profile_link: true,
    player_type: true
  };

  ngOnInit() {
    this.avatar_url = localStorage.getItem('avatar_url');
  }

  addComment(post: PostContext) {
    post.addComment$ = this._gallerySingleService
      .addComment({
        post_id: post.id,
        ...post.commentForm.value
      })
      .pipe(
        map(resp => {
          post.commentForm.reset();
          post.comments.total++;
          let isViewedMore: boolean = post.commentPageNo > 1;
          if (isViewedMore) post.commentPageNo = 1;
          this.getCommentListing(post, false);
        }),
        catchError(err => {
          this._toastrService.error('Error', err.error.message);
          throw err;
        }),
        untilDestroyed(this)
      );
  }

  activateCommentBox(post: PostContext) {
    post.show_comment_box = true;
  }

  getCommentListing(post: PostContext, shouldLoad?: boolean) {
    this._gallerySingleService
      .getCommentListing({
        page_no: post.commentPageNo,
        page_size: post.commentPageSize,
        post_id: post.id
      })
      .pipe(untilDestroyed(this))
      .subscribe(
        response => {
          let comments: CommentContext[] = response.data.records;
          comments.forEach(comment => {
            if (comment.commented_by.avatar) {
              comment.commented_by.avatar =
                environment.mediaUrl + comment.commented_by.avatar;
            }
          });
          if (!shouldLoad) {
            post.commentListing = comments;
          } else {
            post.commentListing.reverse();
            comments.forEach(comment => {
              if (!post.commentListing.includes(comment)) {
                post.commentListing.push(comment);
              }
            });
          }
          post.commentListing.reverse();
        },
        error => {
          this._toastrService.error('Error', error.error.message);
        }
      );
  }

  toggleLike(post: PostContext) {
    if (post.is_liked) {
      post.like$ = this._gallerySingleService
        .unlikePost({ post_id: post.id })
        .pipe(
          map(resp => {
            post.is_liked = false;
            post.likes--;
          }),
          catchError(err => {
            this._toastrService.error('Error', err.error.message);
            throw err;
          }),
          untilDestroyed(this)
        );
    } else {
      post.like$ = this._gallerySingleService
        .likePost({ post_id: post.id })
        .pipe(
          map(resp => {
            post.is_liked = true;
            post.likes++;
          }),
          catchError(err => {
            this._toastrService.error('Error', err.error.message);
            throw err;
          }),
          untilDestroyed(this)
        );
    }
  }

  createCommentForm(post: PostContext) {
    post.commentForm = this._formBuilder.group({
      comment: ['', [Validators.required, wordCount]]
    });
  }

  getVideo() {
    this._gallerySingleService
      .getVideo({
        comments: 1,
        video_id: this.videoId
      })
      .pipe(untilDestroyed(this))
      .subscribe(
        response => {
          let post: PostContext = response.data;
          if (post.posted_by.avatar) {
            post.posted_by.avatar =
              environment.mediaUrl + post.posted_by.avatar;
          }
          if (post.post.media_url) {
            post.post.media_url = environment.mediaUrl + post.post.media_url;
          }
          post.commentPageNo = 1;
          post.commentPageSize = 3;
          post.commentListing = [];
          let comments: CommentContext[] = post.comments.data;
          comments.forEach(comment => {
            if (comment.commented_by.avatar) {
              comment.commented_by.avatar =
                environment.mediaUrl + comment.commented_by.avatar;
            }
          });
          post.commentListing = comments;
          post.commentListing.reverse();

          let commentForm: FormGroup;
          post.commentForm = commentForm;
          this.createCommentForm(post);

          if (!this.postListing.includes(post)) {
            this.postListing.push(post);
          }
        },
        error => {
          this._toastrService.error('Error', error.error.message);
        }
      );
  }

  loadComments(post: PostContext) {
    if (post.comments.total === post.commentListing.length) return;
    post.commentPageNo++;
    this.getCommentListing(post, true);
  }

  deletePost(post_id: string) {
    const dialogRef = this.dialog.open(DeleteConfirmationComponent, {
      width: '50% ',
      panelClass: 'filterDialog',
      data: {
        header: 'Delete post',
        message: 'Are you sure you want to delete?'
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this._gallerySingleService
          .deletePost(post_id)
          .pipe(untilDestroyed(this))
          .subscribe(
            response => {
              this._toastrService.success(
                `Success`,
                'Post deleted successfully'
              );
              this.getVideo();
            },
            error => {
              this._toastrService.error(
                `${error.error.message}`,
                'Delete post'
              );
            }
          );
      }
    });
  }

  ngOnDestroy() {}
}