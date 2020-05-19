import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CredentialsService } from '@app/core';
const routes = {
  getPlayerList: (c: CommonContext) => '/member/player/list',
  getClubList: (c: CommonContext) => '/member/club/list',
  getAcademyList: (c: CommonContext) => '/member/academy/list',
  deleteUser: (c: DeleteUserContext) => '/member/delete',
  activeUser: (c: StatusUserContext) => '/member/status-activate',
  deactivateUser: (c: StatusUserContext) => '/member/status-deactivate',
  addState: (c: AddStateContext) => '/master/state/add',
  getLocationStats: () => '/master/location/stats',
  getStateListByCountry: (c: GetStateListByCountryContext) =>
    '/master/state/list',
  addCity: (c: AddCityContext) => '/master/city/add',
  getCityListByState: (c: GetCityListByStateContext) => '/master/city/list',
  getMemberTypeList: () => '/member-type/list',
  addAbility: (c: AddAbilityContext) =>
    '/master/player-specialization/ability/add',
  getAbilityList: () => '/master/player-specialization/ability/list',
  updateAbilityById: (c: UpdateAbilityByIdContext) =>
    '/master/player-specialization/ability',
  addParameter: (c: AddParameterContext) =>
    '/master/player-specialization/parameter/add',
  getParameterListByAbility: (c: GetParameterListContext) =>
    '/master/player-specialization/parameter/list',
  updateParameterById: (c: UpdateParameterByIdContext) =>
    '/master/player-specialization/parameter'
};

interface AddParameterContext {
  name: string;
  ability_id: string;
}
interface AddParameterResponseContext {
  status: string;
  message: string;
}
interface GetParameterListContext {
  ability_id: string;
}
interface GetParameterListResponseContext {
  status: string;
  message: string;
  data: {
    ability: string;
    total: number;
    records: {
      id: string;
      name: string;
    }[];
  };
}
interface UpdateParameterByIdContext {
  name: string;
  ability_id: string;
  parameter_id: string;
}
interface UpdateParameterByIdResponseContext {
  status: string;
  message: string;
}
interface GetMemberTypeListResponseContext {
  status: string;
  message: string;
  data: {
    id: string;
    category: string;
    sub_category: string;
  }[];
}
interface GetAbilityListResponseContext {
  status: string;
  message: string;
  data: {
    total: number;
    records: {
      id: string;
      name: string;
    }[];
  };
}

export interface CommonContext {
  page_no?: number;
  page_size?: number;
  sort_by?: string;
  sort_order?: number;
  search?: string;
  from?: string;
  to?: string;
  name?: string;
  type?: string;
  email?: string;
  position?: string;
  email_verified?: string;
  profile_status?: string;
}

interface GetCityListByStateContext {
  country_id: string;
  state_id: string;
  page_size?: number;
  page_no?: number;
  search?: string;
}
interface AddCityContext {
  state_id: string;
  country_id: string;
  name: string;
}

interface GetStateListByCountryContext {
  country_id: string;
}

interface PlayerListResponseContext {
  data: {
    total: number;
    records: {
      name: string;
      position: string;
      type: string;
      email: string;
      status: string;
    }[];
    players_count: {
      grassroot: number;
      professional: number;
      amateur: number;
    };
  };
}
interface ClubListResponseContext {
  data: {
    total: number;
    records: {
      name: string;
      no_of_players: string;
      email: string;
      status: string;
    }[];
  };
}

interface AcademyListResponseContext {
  data: {
    total: number;
    records: {
      name: string;
      no_of_players: string;
      email: string;
      status: string;
    }[];
  };
}

interface AddStateContext {
  name: string;
  country_id: string;
}
interface AddAbilityContext {
  name: string;
}

let clubResponse = {
  data: {
    total: 1,
    records: [
      {
        name: 'club1',
        no_of_players: '',
        email: 'club1@gmail.com',
        status: 'pending'
      },
      {
        name: 'club2',
        no_of_players: '2',
        email: 'club1@gmail.com',
        status: 'pending'
      }
    ]
  }
};

let academyResponse = {
  data: {
    total: 2,
    records: [
      {
        name: 'acad1',
        no_of_players: '10',
        email: 'acad1@gmail.com',
        status: 'pending'
      },
      {
        name: 'acad',
        no_of_players: '',
        email: 'acad@gmail.com',
        status: 'active'
      }
    ]
  }
};

interface DeleteUserResponseContext {
  status: string;
  message: string;
}

interface DeleteUserContext {
  user_id: string;
}
interface StatusUserContext {
  user_id: string;
}
interface UpdateAbilityByIdContext {
  id: string;
  name: string;
}

interface StatusUserResponseContext {
  status: string;
  message: string;
}

interface AddStateResponseContext {
  status: string;
  message: string;
}
interface AddAbilityResponseContext {
  status: string;
  message: string;
}
interface LocationStatsResponseContext {
  data: {
    country: string;
    country_id: string;
    no_of_state: number;
    no_of_city: number;
  }[];
}

interface GetCityStateListResponseContext {
  status: string;
  message: string;
  data: {
    total: number;
    records: {
      name: string;
      id: string;
    }[];
  };
}

interface AddCityResponseContext {
  status: string;
  message: string;
}
interface UpdateAbilityByIdResponseContext {
  status: string;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  constructor(
    private httpClient: HttpClient,
    private credentialsService: CredentialsService
  ) {}

  getPlayerList(context: CommonContext): Observable<PlayerListResponseContext> {
    let query = '?';
    if (context['page_no']) {
      query += 'page_no=' + context['page_no'];
    }
    if (context['page_size']) {
      query += '&page_size=' + context['page_size'];
    }
    if (context['search']) {
      query += '&search=' + context['search'];
    }
    if (context['sort_by']) {
      query += '&sort_by=' + context['sort_by'];
    }
    if (context['sort_order']) {
      query += '&sort_order=' + context['sort_order'];
    }

    if (context['from']) {
      query += '&from=' + context['from'];
    }
    if (context['to']) {
      query += '&to=' + context['to'];
    }
    if (context['name']) {
      query += '&name=' + context['name'];
    }
    if (context['type']) {
      query += '&type=' + context['type'];
    }
    if (context['email']) {
      query += '&email=' + context['email'];
    }
    if (context['position']) {
      query += '&position=' + context['position'];
    }
    if (context['email_verified']) {
      query += '&email_verified=' + context['email_verified'];
    }
    if (context['profile_status']) {
      query += '&profile_status=' + context['profile_status'];
    }

    return this.httpClient.get<PlayerListResponseContext>(
      routes.getPlayerList(context) + query
    );
  }

  getClubList(context: CommonContext): Observable<ClubListResponseContext> {
    let query = '?';
    if (context['page_no']) {
      query += 'page_no=' + context['page_no'];
    }
    if (context['page_size']) {
      query += '&page_size=' + context['page_size'];
    }
    if (context['search']) {
      query += '&search=' + context['search'];
    }
    if (context['sort_by']) {
      query += '&sort_by=' + context['sort_by'];
    }
    if (context['sort_order']) {
      query += '&sort_order=' + context['sort_order'];
    }
    if (context['from']) {
      query += '&from=' + context['from'];
    }
    if (context['to']) {
      query += '&to=' + context['to'];
    }
    if (context['email']) {
      query += '&email=' + context['email'];
    }
    if (context['name']) {
      query += '&name=' + context['name'];
    }
    if (context['email_verified']) {
      query += '&email_verified=' + context['email_verified'];
    }
    if (context['']) {
      query += '&profile_status=' + context['profile_status'];
    }

    return this.httpClient.get<ClubListResponseContext>(
      routes.getClubList(context) + query
    );
  }

  getAcademyList(
    context: CommonContext
  ): Observable<AcademyListResponseContext> {
    let token = this.credentialsService.isAuthenticated()
      ? this.credentialsService.credentials['data']['token']
      : '';

    let query = '?';
    if (context['page_no']) {
      query += 'page_no=' + context['page_no'];
    }
    if (context['page_size']) {
      query += '&page_size=' + context['page_size'];
    }
    if (context['search']) {
      query += '&search=' + context['search'];
    }
    if (context['sort_by']) {
      query += '&sort_by=' + context['sort_by'];
    }
    if (context['sort_order']) {
      query += '&sort_order=' + context['sort_order'];
    }
    if (context['from']) {
      query += '&from=' + context['from'];
    }
    if (context['to']) {
      query += '&to=' + context['to'];
    }
    if (context['email']) {
      query += '&email=' + context['email'];
    }
    if (context['name']) {
      query += '&name=' + context['name'];
    }
    if (context['profile_status']) {
      query += '&profile_status=' + context['profile_status'];
    }
    if (context['email_verified']) {
      query += '&email_verified=' + context['email_verified'];
    }

    return this.httpClient.get<AcademyListResponseContext>(
      routes.getAcademyList(context) + query
    );
  }

  deleteUser(
    context: DeleteUserContext
  ): Observable<DeleteUserResponseContext> {
    let params = '/';
    if (context['user_id']) {
      params += `${context['user_id']}`;
    }

    return this.httpClient.delete<DeleteUserResponseContext>(
      routes.deleteUser(context) + params
    );
  }

  activeUser(
    context: StatusUserContext
  ): Observable<StatusUserResponseContext> {
    let params = '/';
    if (context['user_id']) {
      params += `${context['user_id']}`;
    }

    return this.httpClient.put<StatusUserResponseContext>(
      routes.activeUser(context) + params,
      context
    );
  }
  deactivateUser(
    context: StatusUserContext
  ): Observable<StatusUserResponseContext> {
    let params = '/';
    if (context['user_id']) {
      params += `${context['user_id']}`;
    }

    return this.httpClient.put<StatusUserResponseContext>(
      routes.deactivateUser(context) + params,
      context
    );
  }
  addState(context: AddStateContext): Observable<AddStateResponseContext> {
    // let params = '/';
    // if (context['country_id']) {
    //   params += `${context['country_id']}`;
    // }
    return this.httpClient.post<AddStateResponseContext>(
      routes.addState(context),
      context
    );
  }

  getLocationStats(): Observable<LocationStatsResponseContext> {
    return this.httpClient.get<LocationStatsResponseContext>(
      routes.getLocationStats()
    );
  }

  getStateListByCountry(
    context: GetStateListByCountryContext
  ): Observable<GetCityStateListResponseContext> {
    let params = '/';
    if (context['country_id']) {
      params += `${context['country_id']}`;
    }
    return this.httpClient.get<GetCityStateListResponseContext>(
      routes.getStateListByCountry(context) + params
    );
  }

  addCity(context: AddCityContext): Observable<AddCityResponseContext> {
    return this.httpClient.post<AddCityResponseContext>(
      routes.addCity(context),
      context
    );
  }
  getCityListByState(
    context: GetCityListByStateContext
  ): Observable<GetCityStateListResponseContext> {
    let params = '/';
    if (context['country_id']) {
      params += `${context['country_id']}`;
    }
    if (context['state_id']) {
      params += `/${context['state_id']}`;
    }
    let query = '?';
    if (context['page_no']) {
      query += 'page_no=' + context['page_no'];
    }
    if (context['page_size']) {
      query += '&page_size=' + context['page_size'];
    }
    if (context['search']) {
      query += '&search=' + context['search'];
    }
    return this.httpClient.get<GetCityStateListResponseContext>(
      routes.getCityListByState(context) + params + query
    );
  }

  getMemberTypeList(): Observable<GetMemberTypeListResponseContext> {
    return this.httpClient.get<GetMemberTypeListResponseContext>(
      routes.getMemberTypeList()
    );
  }

  addAbility(
    context: AddAbilityContext
  ): Observable<AddAbilityResponseContext> {
    return this.httpClient.post<AddAbilityResponseContext>(
      routes.addAbility(context),
      context
    );
  }

  getAbilityList(): Observable<GetAbilityListResponseContext> {
    return this.httpClient.get<GetAbilityListResponseContext>(
      routes.getAbilityList()
    );
  }

  updateAbilityById(
    context: UpdateAbilityByIdContext
  ): Observable<UpdateAbilityByIdResponseContext> {
    let params = '/';
    if (context['id']) {
      params += `${context['id']}`;
    }
    const { name } = context;

    return this.httpClient.put<UpdateAbilityByIdResponseContext>(
      routes.updateAbilityById(context) + params,
      { name }
    );
  }

  addParameter(
    context: AddParameterContext
  ): Observable<AddParameterResponseContext> {
    let token = this.credentialsService.isAuthenticated()
      ? this.credentialsService.credentials['data']['token']
      : '';
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token
      })
    };
    return this.httpClient.post<AddParameterResponseContext>(
      routes.addParameter(context),
      context,
      httpOptions
    );
  }

  getParameterListByAbility(
    context: GetParameterListContext
  ): Observable<GetParameterListResponseContext> {
    let token = this.credentialsService.isAuthenticated()
      ? this.credentialsService.credentials['data']['token']
      : '';
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token
      })
    };
    let params = '/';
    if (context['ability_id']) {
      params += `${context['ability_id']}`;
    }
    return this.httpClient.get<GetParameterListResponseContext>(
      routes.getParameterListByAbility(context) + params,
      httpOptions
    );
  }

  updateParameterById(
    context: UpdateParameterByIdContext
  ): Observable<UpdateParameterByIdResponseContext> {
    let token = this.credentialsService.isAuthenticated()
      ? this.credentialsService.credentials['data']['token']
      : '';
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token
      })
    };
    let params = '/';
    if (context['ability_id']) {
      params += `${context['ability_id']}`;
    }
    if (context['parameter_id']) {
      params += `/${context['parameter_id']}`;
    }
    const { name } = context;

    return this.httpClient.put<UpdateParameterByIdResponseContext>(
      routes.updateParameterById(context) + params,
      { name },
      httpOptions
    );
  }
}