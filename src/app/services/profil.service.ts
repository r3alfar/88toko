import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList, AngularFireObject } from '@angular/fire/database';
import { Favorites } from '../models/favorites.model';
import { Profile } from '../models/profile.model';

@Injectable({
  providedIn: 'root'
})
export class ProfilService {

  constructor(
    private db: AngularFireDatabase
  ) { }

  getProfile(key: string): AngularFireObject<Profile> {
    return this.db.object(`profile/${key}`);
  }

  getFavorites(key: string): AngularFireList<Favorites> {
    return this.db.list(`profile/${key}/favorites`);
  }

}
