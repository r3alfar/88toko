export interface Profile {
    key: string;
    email: string;
    name: string;
    username: string;
    imageUrl: string;
    alamat: string;
    isadmin: string;
    favorites: FavoriteItem[];
}

export interface FavoriteItem {
    prodId: string;
}