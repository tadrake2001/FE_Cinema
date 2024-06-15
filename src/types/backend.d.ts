export interface IBackendRes<T> {
    error?: string | string[];
    message: string;
    statusCode: number | string;
    data?: T;
}

export interface IModelPaginate<T> {
    meta: {
        current: number;
        pageSize: number;
        pages: number;
        total: number;
    },
    result: T[]
}

export interface IModelPaginate<T> {
    meta: {
        current: number;
        pageSize: number;
        pages: number;
        total: number;
    },
    result: T[]
}

export interface IModelPaginate1<T> {
    items: T[]
}

export interface IAccount {
    access_token: string;
    user: {
        _id: string;
        email: string;
        name: string;
        role: {
            _id: string;
            name: string;
        }
        permissions: {
            _id: string;
            name: string;
            apiPath: string;
            method: string;
            module: string;
        }[]
    }
}

export interface IGetAccount extends Omit<IAccount, "access_token"> { }

export interface IFilm {
    _id?: string;
    name: string;
    director?: string;
    logo: string;
    time: number;
    description: string;
    startDate: Date;
    endDate: Date;
    genres?: string[];
    actors?: string[];
    images?:string[];
    isActive?: boolean;
    createdBy?: string;
    isDeleted?: boolean;
    deletedAt?: boolean | null;
    createdAt?: string;
    updatedAt?: string;
}



export interface IUser {
    _id?: string;
    name: string;
    email: string;
    password?: string;
    age: number;
    gender: string;
    address: string;
    role?: {
        _id: string;
        name: string;
    }
    film?: {
        _id: string;
        name: string;
    }
    createdBy?: string;
    isDeleted?: boolean;
    deletedAt?: boolean | null;
    createdAt?: string;
    updatedAt?: string;
}

export interface ICinema {
    _id?: string;
    name: string;
    logo: string;
    description: string;
    createdBy?: string;
    isDeleted?: boolean;
    deletedAt?: boolean | null;
    createdAt?: string;
    updatedAt?: string;
    address: string;
}

export interface ISnack {
    _id?: string;
    name: string;
    price: number;
    image: string;
    description: string;
    createdBy?: string;
    isDeleted?: boolean;
    deletedAt?: boolean | null;
    createdAt?: string;
    updatedAt?: string;
    address: string;
}

export interface IPromotion {
    _id?: string;
    name: string;
    logo: string;
    description: string;
    startDate: Date;
    endDate: Date;
    link: string;
    createdBy?: string;
    isDeleted?: boolean;
    deletedAt?: boolean | null;
    createdAt?: string;
    updatedAt?: string;
}


export interface IShowtime {
    _id?: string;
    seats?: {
        _id: string;
        status: string;
        price: number;
    }[];
    room?: {
        _id: string;
        name: string;
    }
    cinema?: {
        _id: string;
        name: string;
    }
    film?: {
        _id: string;
        name: string;
        time: number;
    }
    dateStart?: Date;
    dateEnd?: Date;
    createdBy?: string;
    isDeleted?: boolean;
    deletedAt?: boolean | null;
    createdAt?: string;
    updatedAt?: string;
    slotNumberSet?: number;
    slotNumber?: number;
}

export interface IRoom {
    _id?: string;
    name: string;
    type: string;
    seats: number;
    cinema?: {
        _id: string;
        name: string;
    }
    createdBy?: string;
    isDeleted?: boolean;
    deletedAt?: boolean | null;
    createdAt?: string;
    updatedAt?: string;
}

export interface IDiscount {
    _id?: string;
    name: string;
    typeDiscount: string;
    discount: number;
    createdBy?: string;
    isDeleted?: boolean;
    deletedAt?: boolean | null;
    createdAt?: string;
    updatedAt?: string;
}

export interface ITicket {
    _id?: string;
    email: string;
    userId: string;
    url: string;
    status: string;
    roomId: string | {
        _id: string;
        name: string;
    };
    filmId: string | {
        _id: string;
        name: string;
    };
    history?: {
        status: string;
        updatedAt: Date;
        updatedBy: { _id: string; email: string }
    }[]
    createdBy?: string;
    isDeleted?: boolean;
    deletedAt?: boolean | null;
    createdAt?: string;
    updatedAt?: string;
}

export interface IRole {
    _id?: string;
    name: string;
    description: string;
    isActive: boolean;
    permissions: IPermission[] | string[];

    createdBy?: string;
    isDeleted?: boolean;
    deletedAt?: boolean | null;
    createdAt?: string;
    updatedAt?: string;
}

export interface IPermission {
    _id?: string;
    name?: string;
    apiPath?: string;
    method?: string;
    module?: string;

    createdBy?: string;
    isDeleted?: boolean;
    deletedAt?: boolean | null;
    createdAt?: string;
    updatedAt?: string;

}
