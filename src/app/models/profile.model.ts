export interface Profile {
    key: string;
    email: string;
    name: string;
    username: string;
    imageUrl: string;
    alamat: string;
    isadmin: string;
    favorites: FavoriteItem[];
    noTelp?: string;
}

export interface FavoriteItem {
    prodId: string;
}