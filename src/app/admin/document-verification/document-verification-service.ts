import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const routes = {
  getPlayerStatus: (id: string) => `/admin/player/${id}/documents`,
  updatePlayerStatus: (id: string) => `/admin/player/${id}/documents/status`,
  getClubAcademyStatus: (id: string) => `/admin/club-academy/${id}/documents`,
  updateClubAcademyStatus: (id: string) =>
    `/admin/club-academy/${id}/documents/status`,
  getEmploymentContractList: (id: string) =>
    `/admin/employment-contract/${id}/list`
};

@Injectable({
  providedIn: 'root'
})
export class DocumentVerificationService {
  constructor(private httpClient: HttpClient) {}

  getDocumentStatus(id: string, member_type: string): Observable<any> {
    if (member_type === 'player')
      return this.httpClient.get<any>(routes.getPlayerStatus(id));

    return this.httpClient.get<any>(routes.getClubAcademyStatus(id));
  }

  updateDocumentStatus(id: string, member_type: string, data: any) {
    if (member_type === 'player')
      return this.httpClient.put<any>(routes.updatePlayerStatus(id), data);

    return this.httpClient.put<any>(routes.updateClubAcademyStatus(id), data);
  }
  getEmploymentContractList(id: string): Observable<any> {
    return this.httpClient.get<any>(routes.getEmploymentContractList(id));
  }
}
