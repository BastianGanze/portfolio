/* eslint-disable */
import type {TypedDocumentNode as DocumentNode} from '@graphql-typed-document-node/core';

export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
    ID: { input: string; output: string; }
    String: { input: string; output: string; }
    Boolean: { input: boolean; output: boolean; }
    Int: { input: number; output: number; }
    Float: { input: number; output: number; }
    DateTime: { input: any; output: any; }
    /** The `JSON` scalar type represents JSON values as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf). */
    JSON: { input: any; output: any; }
    /** The `Upload` scalar type represents a file upload. */
    Upload: { input: any; output: any; }
};

export type AuthenticatedItem = User;

export type BooleanFilter = {
    equals?: InputMaybe<Scalars['Boolean']['input']>;
    not?: InputMaybe<BooleanFilter>;
};

export type CreateInitialUserInput = {
    email?: InputMaybe<Scalars['String']['input']>;
    name?: InputMaybe<Scalars['String']['input']>;
    password?: InputMaybe<Scalars['String']['input']>;
};

export type DateTimeNullableFilter = {
    equals?: InputMaybe<Scalars['DateTime']['input']>;
    gt?: InputMaybe<Scalars['DateTime']['input']>;
    gte?: InputMaybe<Scalars['DateTime']['input']>;
    in?: InputMaybe<Array<Scalars['DateTime']['input']>>;
    lt?: InputMaybe<Scalars['DateTime']['input']>;
    lte?: InputMaybe<Scalars['DateTime']['input']>;
    not?: InputMaybe<DateTimeNullableFilter>;
    notIn?: InputMaybe<Array<Scalars['DateTime']['input']>>;
};

export type IdFilter = {
    equals?: InputMaybe<Scalars['ID']['input']>;
    gt?: InputMaybe<Scalars['ID']['input']>;
    gte?: InputMaybe<Scalars['ID']['input']>;
    in?: InputMaybe<Array<Scalars['ID']['input']>>;
    lt?: InputMaybe<Scalars['ID']['input']>;
    lte?: InputMaybe<Scalars['ID']['input']>;
    not?: InputMaybe<IdFilter>;
    notIn?: InputMaybe<Array<Scalars['ID']['input']>>;
};

export enum ImageExtension {
    Gif = 'gif',
    Jpg = 'jpg',
    Png = 'png',
    Webp = 'webp'
}

export type ImageFieldInput = {
    upload: Scalars['Upload']['input'];
};

export type ImageFieldOutput = {
    __typename?: 'ImageFieldOutput';
    extension: ImageExtension;
    filesize: Scalars['Int']['output'];
    height: Scalars['Int']['output'];
    id: Scalars['ID']['output'];
    url: Scalars['String']['output'];
    width: Scalars['Int']['output'];
};

export type IntNullableFilter = {
    equals?: InputMaybe<Scalars['Int']['input']>;
    gt?: InputMaybe<Scalars['Int']['input']>;
    gte?: InputMaybe<Scalars['Int']['input']>;
    in?: InputMaybe<Array<Scalars['Int']['input']>>;
    lt?: InputMaybe<Scalars['Int']['input']>;
    lte?: InputMaybe<Scalars['Int']['input']>;
    not?: InputMaybe<IntNullableFilter>;
    notIn?: InputMaybe<Array<Scalars['Int']['input']>>;
};

export type KeystoneAdminMeta = {
    __typename?: 'KeystoneAdminMeta';
    list?: Maybe<KeystoneAdminUiListMeta>;
    lists: Array<KeystoneAdminUiListMeta>;
};


export type KeystoneAdminMetaListArgs = {
    key: Scalars['String']['input'];
};

export type KeystoneAdminUiFieldGroupMeta = {
    __typename?: 'KeystoneAdminUIFieldGroupMeta';
    description?: Maybe<Scalars['String']['output']>;
    fields: Array<KeystoneAdminUiFieldMeta>;
    label: Scalars['String']['output'];
};

export type KeystoneAdminUiFieldMeta = {
    __typename?: 'KeystoneAdminUIFieldMeta';
    createView: KeystoneAdminUiFieldMetaCreateView;
    customViewsIndex?: Maybe<Scalars['Int']['output']>;
    description?: Maybe<Scalars['String']['output']>;
    fieldMeta?: Maybe<Scalars['JSON']['output']>;
    isFilterable: Scalars['Boolean']['output'];
    isNonNull?: Maybe<Array<KeystoneAdminUiFieldMetaIsNonNull>>;
    isOrderable: Scalars['Boolean']['output'];
    itemView?: Maybe<KeystoneAdminUiFieldMetaItemView>;
    label: Scalars['String']['output'];
    listView: KeystoneAdminUiFieldMetaListView;
    path: Scalars['String']['output'];
    search?: Maybe<QueryMode>;
    viewsIndex: Scalars['Int']['output'];
};


export type KeystoneAdminUiFieldMetaItemViewArgs = {
    id?: InputMaybe<Scalars['ID']['input']>;
};

export type KeystoneAdminUiFieldMetaCreateView = {
    __typename?: 'KeystoneAdminUIFieldMetaCreateView';
    fieldMode: KeystoneAdminUiFieldMetaCreateViewFieldMode;
};

export enum KeystoneAdminUiFieldMetaCreateViewFieldMode {
    Edit = 'edit',
    Hidden = 'hidden'
}

export enum KeystoneAdminUiFieldMetaIsNonNull {
    Create = 'create',
    Read = 'read',
    Update = 'update'
}

export type KeystoneAdminUiFieldMetaItemView = {
    __typename?: 'KeystoneAdminUIFieldMetaItemView';
    fieldMode?: Maybe<KeystoneAdminUiFieldMetaItemViewFieldMode>;
    fieldPosition?: Maybe<KeystoneAdminUiFieldMetaItemViewFieldPosition>;
};

export enum KeystoneAdminUiFieldMetaItemViewFieldMode {
    Edit = 'edit',
    Hidden = 'hidden',
    Read = 'read'
}

export enum KeystoneAdminUiFieldMetaItemViewFieldPosition {
    Form = 'form',
    Sidebar = 'sidebar'
}

export type KeystoneAdminUiFieldMetaListView = {
    __typename?: 'KeystoneAdminUIFieldMetaListView';
    fieldMode: KeystoneAdminUiFieldMetaListViewFieldMode;
};

export enum KeystoneAdminUiFieldMetaListViewFieldMode {
    Hidden = 'hidden',
    Read = 'read'
}

export type KeystoneAdminUiGraphQl = {
    __typename?: 'KeystoneAdminUIGraphQL';
    names: KeystoneAdminUiGraphQlNames;
};

export type KeystoneAdminUiGraphQlNames = {
    __typename?: 'KeystoneAdminUIGraphQLNames';
    createInputName: Scalars['String']['output'];
    createManyMutationName: Scalars['String']['output'];
    createMutationName: Scalars['String']['output'];
    deleteManyMutationName: Scalars['String']['output'];
    deleteMutationName: Scalars['String']['output'];
    itemQueryName: Scalars['String']['output'];
    listOrderName: Scalars['String']['output'];
    listQueryCountName: Scalars['String']['output'];
    listQueryName: Scalars['String']['output'];
    outputTypeName: Scalars['String']['output'];
    relateToManyForCreateInputName: Scalars['String']['output'];
    relateToManyForUpdateInputName: Scalars['String']['output'];
    relateToOneForCreateInputName: Scalars['String']['output'];
    relateToOneForUpdateInputName: Scalars['String']['output'];
    updateInputName: Scalars['String']['output'];
    updateManyInputName: Scalars['String']['output'];
    updateManyMutationName: Scalars['String']['output'];
    updateMutationName: Scalars['String']['output'];
    whereInputName: Scalars['String']['output'];
    whereUniqueInputName: Scalars['String']['output'];
};

export type KeystoneAdminUiListMeta = {
    __typename?: 'KeystoneAdminUIListMeta';
    description?: Maybe<Scalars['String']['output']>;
    fields: Array<KeystoneAdminUiFieldMeta>;
    graphql: KeystoneAdminUiGraphQl;
    groups: Array<KeystoneAdminUiFieldGroupMeta>;
    hideCreate: Scalars['Boolean']['output'];
    hideDelete: Scalars['Boolean']['output'];
    initialColumns: Array<Scalars['String']['output']>;
    initialSearchFields: Array<Scalars['String']['output']>;
    initialSort?: Maybe<KeystoneAdminUiSort>;
    isHidden: Scalars['Boolean']['output'];
    isSingleton: Scalars['Boolean']['output'];
    itemQueryName: Scalars['String']['output'];
    key: Scalars['String']['output'];
    label: Scalars['String']['output'];
    labelField: Scalars['String']['output'];
    listQueryName: Scalars['String']['output'];
    pageSize: Scalars['Int']['output'];
    path: Scalars['String']['output'];
    plural: Scalars['String']['output'];
    singular: Scalars['String']['output'];
};

export type KeystoneAdminUiSort = {
    __typename?: 'KeystoneAdminUISort';
    direction: KeystoneAdminUiSortDirection;
    field: Scalars['String']['output'];
};

export enum KeystoneAdminUiSortDirection {
    Asc = 'ASC',
    Desc = 'DESC'
}

export type KeystoneMeta = {
    __typename?: 'KeystoneMeta';
    adminMeta: KeystoneAdminMeta;
};

export type Mutation = {
    __typename?: 'Mutation';
    authenticateUserWithPassword?: Maybe<UserAuthenticationWithPasswordResult>;
    createInitialUser: UserAuthenticationWithPasswordSuccess;
    createPage?: Maybe<Page>;
    createPages?: Maybe<Array<Maybe<Page>>>;
    createPost?: Maybe<Post>;
    createPosts?: Maybe<Array<Maybe<Post>>>;
    createProject?: Maybe<Project>;
    createProjects?: Maybe<Array<Maybe<Project>>>;
    createTag?: Maybe<Tag>;
    createTags?: Maybe<Array<Maybe<Tag>>>;
    createUser?: Maybe<User>;
    createUsers?: Maybe<Array<Maybe<User>>>;
    deletePage?: Maybe<Page>;
    deletePages?: Maybe<Array<Maybe<Page>>>;
    deletePost?: Maybe<Post>;
    deletePosts?: Maybe<Array<Maybe<Post>>>;
    deleteProject?: Maybe<Project>;
    deleteProjects?: Maybe<Array<Maybe<Project>>>;
    deleteTag?: Maybe<Tag>;
    deleteTags?: Maybe<Array<Maybe<Tag>>>;
    deleteUser?: Maybe<User>;
    deleteUsers?: Maybe<Array<Maybe<User>>>;
    endSession: Scalars['Boolean']['output'];
    updatePage?: Maybe<Page>;
    updatePages?: Maybe<Array<Maybe<Page>>>;
    updatePost?: Maybe<Post>;
    updatePosts?: Maybe<Array<Maybe<Post>>>;
    updateProject?: Maybe<Project>;
    updateProjects?: Maybe<Array<Maybe<Project>>>;
    updateTag?: Maybe<Tag>;
    updateTags?: Maybe<Array<Maybe<Tag>>>;
    updateUser?: Maybe<User>;
    updateUsers?: Maybe<Array<Maybe<User>>>;
};


export type MutationAuthenticateUserWithPasswordArgs = {
    email: Scalars['String']['input'];
    password: Scalars['String']['input'];
};


export type MutationCreateInitialUserArgs = {
    data: CreateInitialUserInput;
};


export type MutationCreatePageArgs = {
    data: PageCreateInput;
};


export type MutationCreatePagesArgs = {
    data: Array<PageCreateInput>;
};


export type MutationCreatePostArgs = {
    data: PostCreateInput;
};


export type MutationCreatePostsArgs = {
    data: Array<PostCreateInput>;
};


export type MutationCreateProjectArgs = {
    data: ProjectCreateInput;
};


export type MutationCreateProjectsArgs = {
    data: Array<ProjectCreateInput>;
};


export type MutationCreateTagArgs = {
    data: TagCreateInput;
};


export type MutationCreateTagsArgs = {
    data: Array<TagCreateInput>;
};


export type MutationCreateUserArgs = {
    data: UserCreateInput;
};


export type MutationCreateUsersArgs = {
    data: Array<UserCreateInput>;
};


export type MutationDeletePageArgs = {
    where: PageWhereUniqueInput;
};


export type MutationDeletePagesArgs = {
    where: Array<PageWhereUniqueInput>;
};


export type MutationDeletePostArgs = {
    where: PostWhereUniqueInput;
};


export type MutationDeletePostsArgs = {
    where: Array<PostWhereUniqueInput>;
};


export type MutationDeleteProjectArgs = {
    where: ProjectWhereUniqueInput;
};


export type MutationDeleteProjectsArgs = {
    where: Array<ProjectWhereUniqueInput>;
};


export type MutationDeleteTagArgs = {
    where: TagWhereUniqueInput;
};


export type MutationDeleteTagsArgs = {
    where: Array<TagWhereUniqueInput>;
};


export type MutationDeleteUserArgs = {
    where: UserWhereUniqueInput;
};


export type MutationDeleteUsersArgs = {
    where: Array<UserWhereUniqueInput>;
};


export type MutationUpdatePageArgs = {
    data: PageUpdateInput;
    where: PageWhereUniqueInput;
};


export type MutationUpdatePagesArgs = {
    data: Array<PageUpdateArgs>;
};


export type MutationUpdatePostArgs = {
    data: PostUpdateInput;
    where: PostWhereUniqueInput;
};


export type MutationUpdatePostsArgs = {
    data: Array<PostUpdateArgs>;
};


export type MutationUpdateProjectArgs = {
    data: ProjectUpdateInput;
    where: ProjectWhereUniqueInput;
};


export type MutationUpdateProjectsArgs = {
    data: Array<ProjectUpdateArgs>;
};


export type MutationUpdateTagArgs = {
    data: TagUpdateInput;
    where: TagWhereUniqueInput;
};


export type MutationUpdateTagsArgs = {
    data: Array<TagUpdateArgs>;
};


export type MutationUpdateUserArgs = {
    data: UserUpdateInput;
    where: UserWhereUniqueInput;
};


export type MutationUpdateUsersArgs = {
    data: Array<UserUpdateArgs>;
};

export type NestedStringFilter = {
    contains?: InputMaybe<Scalars['String']['input']>;
    endsWith?: InputMaybe<Scalars['String']['input']>;
    equals?: InputMaybe<Scalars['String']['input']>;
    gt?: InputMaybe<Scalars['String']['input']>;
    gte?: InputMaybe<Scalars['String']['input']>;
    in?: InputMaybe<Array<Scalars['String']['input']>>;
    lt?: InputMaybe<Scalars['String']['input']>;
    lte?: InputMaybe<Scalars['String']['input']>;
    not?: InputMaybe<NestedStringFilter>;
    notIn?: InputMaybe<Array<Scalars['String']['input']>>;
    startsWith?: InputMaybe<Scalars['String']['input']>;
};

export enum OrderDirection {
    Asc = 'asc',
    Desc = 'desc'
}

export type Page = {
    __typename?: 'Page';
    content?: Maybe<Page_Content_Document>;
    contentGerman?: Maybe<Page_ContentGerman_Document>;
    createdAt?: Maybe<Scalars['DateTime']['output']>;
    id: Scalars['ID']['output'];
    name?: Maybe<Scalars['String']['output']>;
    title?: Maybe<Scalars['String']['output']>;
    titleGerman?: Maybe<Scalars['String']['output']>;
};

export type PageCreateInput = {
    content?: InputMaybe<Scalars['JSON']['input']>;
    contentGerman?: InputMaybe<Scalars['JSON']['input']>;
    createdAt?: InputMaybe<Scalars['DateTime']['input']>;
    name?: InputMaybe<Scalars['String']['input']>;
    title?: InputMaybe<Scalars['String']['input']>;
    titleGerman?: InputMaybe<Scalars['String']['input']>;
};

export type PageOrderByInput = {
    createdAt?: InputMaybe<OrderDirection>;
    id?: InputMaybe<OrderDirection>;
    name?: InputMaybe<OrderDirection>;
    title?: InputMaybe<OrderDirection>;
    titleGerman?: InputMaybe<OrderDirection>;
};

export type PageUpdateArgs = {
    data: PageUpdateInput;
    where: PageWhereUniqueInput;
};

export type PageUpdateInput = {
    content?: InputMaybe<Scalars['JSON']['input']>;
    contentGerman?: InputMaybe<Scalars['JSON']['input']>;
    createdAt?: InputMaybe<Scalars['DateTime']['input']>;
    name?: InputMaybe<Scalars['String']['input']>;
    title?: InputMaybe<Scalars['String']['input']>;
    titleGerman?: InputMaybe<Scalars['String']['input']>;
};

export type PageWhereInput = {
    AND?: InputMaybe<Array<PageWhereInput>>;
    NOT?: InputMaybe<Array<PageWhereInput>>;
    OR?: InputMaybe<Array<PageWhereInput>>;
    createdAt?: InputMaybe<DateTimeNullableFilter>;
    id?: InputMaybe<IdFilter>;
    name?: InputMaybe<StringFilter>;
    title?: InputMaybe<StringFilter>;
    titleGerman?: InputMaybe<StringFilter>;
};

export type PageWhereUniqueInput = {
    id?: InputMaybe<Scalars['ID']['input']>;
};

export type Page_ContentGerman_Document = {
    __typename?: 'Page_contentGerman_Document';
    document: Scalars['JSON']['output'];
};


export type Page_ContentGerman_DocumentDocumentArgs = {
    hydrateRelationships?: Scalars['Boolean']['input'];
};

export type Page_Content_Document = {
    __typename?: 'Page_content_Document';
    document: Scalars['JSON']['output'];
};


export type Page_Content_DocumentDocumentArgs = {
    hydrateRelationships?: Scalars['Boolean']['input'];
};

export type PasswordState = {
    __typename?: 'PasswordState';
    isSet: Scalars['Boolean']['output'];
};

export type Post = {
    __typename?: 'Post';
    content?: Maybe<Post_Content_Document>;
    contentGerman?: Maybe<Post_ContentGerman_Document>;
    createdAt?: Maybe<Scalars['DateTime']['output']>;
    id: Scalars['ID']['output'];
    tags?: Maybe<Array<Tag>>;
    tagsCount?: Maybe<Scalars['Int']['output']>;
    title?: Maybe<Scalars['String']['output']>;
    titleGerman?: Maybe<Scalars['String']['output']>;
};


export type PostTagsArgs = {
    cursor?: InputMaybe<TagWhereUniqueInput>;
    orderBy?: Array<TagOrderByInput>;
    skip?: Scalars['Int']['input'];
    take?: InputMaybe<Scalars['Int']['input']>;
    where?: TagWhereInput;
};


export type PostTagsCountArgs = {
    where?: TagWhereInput;
};

export type PostCreateInput = {
    content?: InputMaybe<Scalars['JSON']['input']>;
    contentGerman?: InputMaybe<Scalars['JSON']['input']>;
    createdAt?: InputMaybe<Scalars['DateTime']['input']>;
    tags?: InputMaybe<TagRelateToManyForCreateInput>;
    title?: InputMaybe<Scalars['String']['input']>;
    titleGerman?: InputMaybe<Scalars['String']['input']>;
};

export type PostManyRelationFilter = {
    every?: InputMaybe<PostWhereInput>;
    none?: InputMaybe<PostWhereInput>;
    some?: InputMaybe<PostWhereInput>;
};

export type PostOrderByInput = {
    createdAt?: InputMaybe<OrderDirection>;
    id?: InputMaybe<OrderDirection>;
    title?: InputMaybe<OrderDirection>;
    titleGerman?: InputMaybe<OrderDirection>;
};

export type PostRelateToManyForCreateInput = {
    connect?: InputMaybe<Array<PostWhereUniqueInput>>;
    create?: InputMaybe<Array<PostCreateInput>>;
};

export type PostRelateToManyForUpdateInput = {
    connect?: InputMaybe<Array<PostWhereUniqueInput>>;
    create?: InputMaybe<Array<PostCreateInput>>;
    disconnect?: InputMaybe<Array<PostWhereUniqueInput>>;
    set?: InputMaybe<Array<PostWhereUniqueInput>>;
};

export type PostUpdateArgs = {
    data: PostUpdateInput;
    where: PostWhereUniqueInput;
};

export type PostUpdateInput = {
    content?: InputMaybe<Scalars['JSON']['input']>;
    contentGerman?: InputMaybe<Scalars['JSON']['input']>;
    createdAt?: InputMaybe<Scalars['DateTime']['input']>;
    tags?: InputMaybe<TagRelateToManyForUpdateInput>;
    title?: InputMaybe<Scalars['String']['input']>;
    titleGerman?: InputMaybe<Scalars['String']['input']>;
};

export type PostWhereInput = {
    AND?: InputMaybe<Array<PostWhereInput>>;
    NOT?: InputMaybe<Array<PostWhereInput>>;
    OR?: InputMaybe<Array<PostWhereInput>>;
    createdAt?: InputMaybe<DateTimeNullableFilter>;
    id?: InputMaybe<IdFilter>;
    tags?: InputMaybe<TagManyRelationFilter>;
    title?: InputMaybe<StringFilter>;
    titleGerman?: InputMaybe<StringFilter>;
};

export type PostWhereUniqueInput = {
    id?: InputMaybe<Scalars['ID']['input']>;
};

export type Post_ContentGerman_Document = {
    __typename?: 'Post_contentGerman_Document';
    document: Scalars['JSON']['output'];
};


export type Post_ContentGerman_DocumentDocumentArgs = {
    hydrateRelationships?: Scalars['Boolean']['input'];
};

export type Post_Content_Document = {
    __typename?: 'Post_content_Document';
    document: Scalars['JSON']['output'];
};


export type Post_Content_DocumentDocumentArgs = {
    hydrateRelationships?: Scalars['Boolean']['input'];
};

export type Project = {
    __typename?: 'Project';
    content?: Maybe<Project_Content_Document>;
    contentGerman?: Maybe<Project_ContentGerman_Document>;
    createdAt?: Maybe<Scalars['DateTime']['output']>;
    finishedAt?: Maybe<Scalars['DateTime']['output']>;
    game?: Maybe<Scalars['String']['output']>;
    id: Scalars['ID']['output'];
    link?: Maybe<Scalars['String']['output']>;
    mainImage?: Maybe<ImageFieldOutput>;
    roomId?: Maybe<Scalars['Int']['output']>;
    shortDescription?: Maybe<Project_ShortDescription_Document>;
    shortDescriptionGerman?: Maybe<Project_ShortDescriptionGerman_Document>;
    startedAt?: Maybe<Scalars['DateTime']['output']>;
    tags?: Maybe<Array<Tag>>;
    tagsCount?: Maybe<Scalars['Int']['output']>;
    title?: Maybe<Scalars['String']['output']>;
    titleGerman?: Maybe<Scalars['String']['output']>;
    unlockContent?: Maybe<Project_UnlockContent_Document>;
    unlockContentGerman?: Maybe<Project_UnlockContentGerman_Document>;
};


export type ProjectTagsArgs = {
    cursor?: InputMaybe<TagWhereUniqueInput>;
    orderBy?: Array<TagOrderByInput>;
    skip?: Scalars['Int']['input'];
    take?: InputMaybe<Scalars['Int']['input']>;
    where?: TagWhereInput;
};


export type ProjectTagsCountArgs = {
    where?: TagWhereInput;
};

export type ProjectCreateInput = {
    content?: InputMaybe<Scalars['JSON']['input']>;
    contentGerman?: InputMaybe<Scalars['JSON']['input']>;
    createdAt?: InputMaybe<Scalars['DateTime']['input']>;
    finishedAt?: InputMaybe<Scalars['DateTime']['input']>;
    game?: InputMaybe<Scalars['String']['input']>;
    link?: InputMaybe<Scalars['String']['input']>;
    mainImage?: InputMaybe<ImageFieldInput>;
    roomId?: InputMaybe<Scalars['Int']['input']>;
    shortDescription?: InputMaybe<Scalars['JSON']['input']>;
    shortDescriptionGerman?: InputMaybe<Scalars['JSON']['input']>;
    startedAt?: InputMaybe<Scalars['DateTime']['input']>;
    tags?: InputMaybe<TagRelateToManyForCreateInput>;
    title?: InputMaybe<Scalars['String']['input']>;
    titleGerman?: InputMaybe<Scalars['String']['input']>;
    unlockContent?: InputMaybe<Scalars['JSON']['input']>;
    unlockContentGerman?: InputMaybe<Scalars['JSON']['input']>;
};

export type ProjectManyRelationFilter = {
    every?: InputMaybe<ProjectWhereInput>;
    none?: InputMaybe<ProjectWhereInput>;
    some?: InputMaybe<ProjectWhereInput>;
};

export type ProjectOrderByInput = {
    createdAt?: InputMaybe<OrderDirection>;
    finishedAt?: InputMaybe<OrderDirection>;
    game?: InputMaybe<OrderDirection>;
    id?: InputMaybe<OrderDirection>;
    link?: InputMaybe<OrderDirection>;
    roomId?: InputMaybe<OrderDirection>;
    startedAt?: InputMaybe<OrderDirection>;
    title?: InputMaybe<OrderDirection>;
    titleGerman?: InputMaybe<OrderDirection>;
};

export type ProjectRelateToManyForCreateInput = {
    connect?: InputMaybe<Array<ProjectWhereUniqueInput>>;
    create?: InputMaybe<Array<ProjectCreateInput>>;
};

export type ProjectRelateToManyForUpdateInput = {
    connect?: InputMaybe<Array<ProjectWhereUniqueInput>>;
    create?: InputMaybe<Array<ProjectCreateInput>>;
    disconnect?: InputMaybe<Array<ProjectWhereUniqueInput>>;
    set?: InputMaybe<Array<ProjectWhereUniqueInput>>;
};

export type ProjectUpdateArgs = {
    data: ProjectUpdateInput;
    where: ProjectWhereUniqueInput;
};

export type ProjectUpdateInput = {
    content?: InputMaybe<Scalars['JSON']['input']>;
    contentGerman?: InputMaybe<Scalars['JSON']['input']>;
    createdAt?: InputMaybe<Scalars['DateTime']['input']>;
    finishedAt?: InputMaybe<Scalars['DateTime']['input']>;
    game?: InputMaybe<Scalars['String']['input']>;
    link?: InputMaybe<Scalars['String']['input']>;
    mainImage?: InputMaybe<ImageFieldInput>;
    roomId?: InputMaybe<Scalars['Int']['input']>;
    shortDescription?: InputMaybe<Scalars['JSON']['input']>;
    shortDescriptionGerman?: InputMaybe<Scalars['JSON']['input']>;
    startedAt?: InputMaybe<Scalars['DateTime']['input']>;
    tags?: InputMaybe<TagRelateToManyForUpdateInput>;
    title?: InputMaybe<Scalars['String']['input']>;
    titleGerman?: InputMaybe<Scalars['String']['input']>;
    unlockContent?: InputMaybe<Scalars['JSON']['input']>;
    unlockContentGerman?: InputMaybe<Scalars['JSON']['input']>;
};

export type ProjectWhereInput = {
    AND?: InputMaybe<Array<ProjectWhereInput>>;
    NOT?: InputMaybe<Array<ProjectWhereInput>>;
    OR?: InputMaybe<Array<ProjectWhereInput>>;
    createdAt?: InputMaybe<DateTimeNullableFilter>;
    finishedAt?: InputMaybe<DateTimeNullableFilter>;
    game?: InputMaybe<StringFilter>;
    id?: InputMaybe<IdFilter>;
    link?: InputMaybe<StringFilter>;
    roomId?: InputMaybe<IntNullableFilter>;
    startedAt?: InputMaybe<DateTimeNullableFilter>;
    tags?: InputMaybe<TagManyRelationFilter>;
    title?: InputMaybe<StringFilter>;
    titleGerman?: InputMaybe<StringFilter>;
};

export type ProjectWhereUniqueInput = {
    id?: InputMaybe<Scalars['ID']['input']>;
};

export type Project_ContentGerman_Document = {
    __typename?: 'Project_contentGerman_Document';
    document: Scalars['JSON']['output'];
};


export type Project_ContentGerman_DocumentDocumentArgs = {
    hydrateRelationships?: Scalars['Boolean']['input'];
};

export type Project_Content_Document = {
    __typename?: 'Project_content_Document';
    document: Scalars['JSON']['output'];
};


export type Project_Content_DocumentDocumentArgs = {
    hydrateRelationships?: Scalars['Boolean']['input'];
};

export type Project_ShortDescriptionGerman_Document = {
    __typename?: 'Project_shortDescriptionGerman_Document';
    document: Scalars['JSON']['output'];
};


export type Project_ShortDescriptionGerman_DocumentDocumentArgs = {
    hydrateRelationships?: Scalars['Boolean']['input'];
};

export type Project_ShortDescription_Document = {
    __typename?: 'Project_shortDescription_Document';
    document: Scalars['JSON']['output'];
};


export type Project_ShortDescription_DocumentDocumentArgs = {
    hydrateRelationships?: Scalars['Boolean']['input'];
};

export type Project_UnlockContentGerman_Document = {
    __typename?: 'Project_unlockContentGerman_Document';
    document: Scalars['JSON']['output'];
};


export type Project_UnlockContentGerman_DocumentDocumentArgs = {
    hydrateRelationships?: Scalars['Boolean']['input'];
};

export type Project_UnlockContent_Document = {
    __typename?: 'Project_unlockContent_Document';
    document: Scalars['JSON']['output'];
};


export type Project_UnlockContent_DocumentDocumentArgs = {
    hydrateRelationships?: Scalars['Boolean']['input'];
};

export type Query = {
    __typename?: 'Query';
    authenticatedItem?: Maybe<AuthenticatedItem>;
    keystone: KeystoneMeta;
    page?: Maybe<Page>;
    pages?: Maybe<Array<Page>>;
    pagesCount?: Maybe<Scalars['Int']['output']>;
    post?: Maybe<Post>;
    posts?: Maybe<Array<Post>>;
    postsCount?: Maybe<Scalars['Int']['output']>;
    project?: Maybe<Project>;
    projects?: Maybe<Array<Project>>;
    projectsCount?: Maybe<Scalars['Int']['output']>;
    tag?: Maybe<Tag>;
    tags?: Maybe<Array<Tag>>;
    tagsCount?: Maybe<Scalars['Int']['output']>;
    user?: Maybe<User>;
    users?: Maybe<Array<User>>;
    usersCount?: Maybe<Scalars['Int']['output']>;
};


export type QueryPageArgs = {
    where: PageWhereUniqueInput;
};


export type QueryPagesArgs = {
    cursor?: InputMaybe<PageWhereUniqueInput>;
    orderBy?: Array<PageOrderByInput>;
    skip?: Scalars['Int']['input'];
    take?: InputMaybe<Scalars['Int']['input']>;
    where?: PageWhereInput;
};


export type QueryPagesCountArgs = {
    where?: PageWhereInput;
};


export type QueryPostArgs = {
    where: PostWhereUniqueInput;
};


export type QueryPostsArgs = {
    cursor?: InputMaybe<PostWhereUniqueInput>;
    orderBy?: Array<PostOrderByInput>;
    skip?: Scalars['Int']['input'];
    take?: InputMaybe<Scalars['Int']['input']>;
    where?: PostWhereInput;
};


export type QueryPostsCountArgs = {
    where?: PostWhereInput;
};


export type QueryProjectArgs = {
    where: ProjectWhereUniqueInput;
};


export type QueryProjectsArgs = {
    cursor?: InputMaybe<ProjectWhereUniqueInput>;
    orderBy?: Array<ProjectOrderByInput>;
    skip?: Scalars['Int']['input'];
    take?: InputMaybe<Scalars['Int']['input']>;
    where?: ProjectWhereInput;
};


export type QueryProjectsCountArgs = {
    where?: ProjectWhereInput;
};


export type QueryTagArgs = {
    where: TagWhereUniqueInput;
};


export type QueryTagsArgs = {
    cursor?: InputMaybe<TagWhereUniqueInput>;
    orderBy?: Array<TagOrderByInput>;
    skip?: Scalars['Int']['input'];
    take?: InputMaybe<Scalars['Int']['input']>;
    where?: TagWhereInput;
};


export type QueryTagsCountArgs = {
    where?: TagWhereInput;
};


export type QueryUserArgs = {
    where: UserWhereUniqueInput;
};


export type QueryUsersArgs = {
    cursor?: InputMaybe<UserWhereUniqueInput>;
    orderBy?: Array<UserOrderByInput>;
    skip?: Scalars['Int']['input'];
    take?: InputMaybe<Scalars['Int']['input']>;
    where?: UserWhereInput;
};


export type QueryUsersCountArgs = {
    where?: UserWhereInput;
};

export enum QueryMode {
    Default = 'default',
    Insensitive = 'insensitive'
}

export type StringFilter = {
    contains?: InputMaybe<Scalars['String']['input']>;
    endsWith?: InputMaybe<Scalars['String']['input']>;
    equals?: InputMaybe<Scalars['String']['input']>;
    gt?: InputMaybe<Scalars['String']['input']>;
    gte?: InputMaybe<Scalars['String']['input']>;
    in?: InputMaybe<Array<Scalars['String']['input']>>;
    lt?: InputMaybe<Scalars['String']['input']>;
    lte?: InputMaybe<Scalars['String']['input']>;
    mode?: InputMaybe<QueryMode>;
    not?: InputMaybe<NestedStringFilter>;
    notIn?: InputMaybe<Array<Scalars['String']['input']>>;
    startsWith?: InputMaybe<Scalars['String']['input']>;
};

export type Tag = {
    __typename?: 'Tag';
    id: Scalars['ID']['output'];
    name?: Maybe<Scalars['String']['output']>;
    posts?: Maybe<Array<Post>>;
    postsCount?: Maybe<Scalars['Int']['output']>;
    projects?: Maybe<Array<Project>>;
    projectsCount?: Maybe<Scalars['Int']['output']>;
};


export type TagPostsArgs = {
    cursor?: InputMaybe<PostWhereUniqueInput>;
    orderBy?: Array<PostOrderByInput>;
    skip?: Scalars['Int']['input'];
    take?: InputMaybe<Scalars['Int']['input']>;
    where?: PostWhereInput;
};


export type TagPostsCountArgs = {
    where?: PostWhereInput;
};


export type TagProjectsArgs = {
    cursor?: InputMaybe<ProjectWhereUniqueInput>;
    orderBy?: Array<ProjectOrderByInput>;
    skip?: Scalars['Int']['input'];
    take?: InputMaybe<Scalars['Int']['input']>;
    where?: ProjectWhereInput;
};


export type TagProjectsCountArgs = {
    where?: ProjectWhereInput;
};

export type TagCreateInput = {
    name?: InputMaybe<Scalars['String']['input']>;
    posts?: InputMaybe<PostRelateToManyForCreateInput>;
    projects?: InputMaybe<ProjectRelateToManyForCreateInput>;
};

export type TagManyRelationFilter = {
    every?: InputMaybe<TagWhereInput>;
    none?: InputMaybe<TagWhereInput>;
    some?: InputMaybe<TagWhereInput>;
};

export type TagOrderByInput = {
    id?: InputMaybe<OrderDirection>;
    name?: InputMaybe<OrderDirection>;
};

export type TagRelateToManyForCreateInput = {
    connect?: InputMaybe<Array<TagWhereUniqueInput>>;
    create?: InputMaybe<Array<TagCreateInput>>;
};

export type TagRelateToManyForUpdateInput = {
    connect?: InputMaybe<Array<TagWhereUniqueInput>>;
    create?: InputMaybe<Array<TagCreateInput>>;
    disconnect?: InputMaybe<Array<TagWhereUniqueInput>>;
    set?: InputMaybe<Array<TagWhereUniqueInput>>;
};

export type TagUpdateArgs = {
    data: TagUpdateInput;
    where: TagWhereUniqueInput;
};

export type TagUpdateInput = {
    name?: InputMaybe<Scalars['String']['input']>;
    posts?: InputMaybe<PostRelateToManyForUpdateInput>;
    projects?: InputMaybe<ProjectRelateToManyForUpdateInput>;
};

export type TagWhereInput = {
    AND?: InputMaybe<Array<TagWhereInput>>;
    NOT?: InputMaybe<Array<TagWhereInput>>;
    OR?: InputMaybe<Array<TagWhereInput>>;
    id?: InputMaybe<IdFilter>;
    name?: InputMaybe<StringFilter>;
    posts?: InputMaybe<PostManyRelationFilter>;
    projects?: InputMaybe<ProjectManyRelationFilter>;
};

export type TagWhereUniqueInput = {
    id?: InputMaybe<Scalars['ID']['input']>;
};

export type User = {
    __typename?: 'User';
    createdAt?: Maybe<Scalars['DateTime']['output']>;
    email?: Maybe<Scalars['String']['output']>;
    id: Scalars['ID']['output'];
    isAdmin?: Maybe<Scalars['Boolean']['output']>;
    name?: Maybe<Scalars['String']['output']>;
    password?: Maybe<PasswordState>;
};

export type UserAuthenticationWithPasswordFailure = {
    __typename?: 'UserAuthenticationWithPasswordFailure';
    message: Scalars['String']['output'];
};

export type UserAuthenticationWithPasswordResult =
    UserAuthenticationWithPasswordFailure
    | UserAuthenticationWithPasswordSuccess;

export type UserAuthenticationWithPasswordSuccess = {
    __typename?: 'UserAuthenticationWithPasswordSuccess';
    item: User;
    sessionToken: Scalars['String']['output'];
};

export type UserCreateInput = {
    createdAt?: InputMaybe<Scalars['DateTime']['input']>;
    email?: InputMaybe<Scalars['String']['input']>;
    isAdmin?: InputMaybe<Scalars['Boolean']['input']>;
    name?: InputMaybe<Scalars['String']['input']>;
    password?: InputMaybe<Scalars['String']['input']>;
};

export type UserOrderByInput = {
    createdAt?: InputMaybe<OrderDirection>;
    email?: InputMaybe<OrderDirection>;
    id?: InputMaybe<OrderDirection>;
    isAdmin?: InputMaybe<OrderDirection>;
    name?: InputMaybe<OrderDirection>;
};

export type UserUpdateArgs = {
    data: UserUpdateInput;
    where: UserWhereUniqueInput;
};

export type UserUpdateInput = {
    createdAt?: InputMaybe<Scalars['DateTime']['input']>;
    email?: InputMaybe<Scalars['String']['input']>;
    isAdmin?: InputMaybe<Scalars['Boolean']['input']>;
    name?: InputMaybe<Scalars['String']['input']>;
    password?: InputMaybe<Scalars['String']['input']>;
};

export type UserWhereInput = {
    AND?: InputMaybe<Array<UserWhereInput>>;
    NOT?: InputMaybe<Array<UserWhereInput>>;
    OR?: InputMaybe<Array<UserWhereInput>>;
    createdAt?: InputMaybe<DateTimeNullableFilter>;
    email?: InputMaybe<StringFilter>;
    id?: InputMaybe<IdFilter>;
    isAdmin?: InputMaybe<BooleanFilter>;
    name?: InputMaybe<StringFilter>;
};

export type UserWhereUniqueInput = {
    email?: InputMaybe<Scalars['String']['input']>;
    id?: InputMaybe<Scalars['ID']['input']>;
};

export type GetPostsQueryVariables = Exact<{
    orderBy: Array<PostOrderByInput> | PostOrderByInput;
    take?: InputMaybe<Scalars['Int']['input']>;
    skip: Scalars['Int']['input'];
}>;


export type GetPostsQuery = {
    __typename?: 'Query',
    posts?: Array<{
        __typename?: 'Post',
        id: string,
        title?: string | null,
        titleGerman?: string | null,
        createdAt?: any | null,
        content?: { __typename?: 'Post_content_Document', document: any } | null,
        contentGerman?: { __typename?: 'Post_contentGerman_Document', document: any } | null,
        tags?: Array<{ __typename?: 'Tag', id: string, name?: string | null }> | null
    }> | null
};

export type GetPagesQueryVariables = Exact<{
    where: PageWhereInput;
}>;


export type GetPagesQuery = {
    __typename?: 'Query',
    pages?: Array<{
        __typename?: 'Page',
        id: string,
        name?: string | null,
        title?: string | null,
        titleGerman?: string | null,
        content?: { __typename?: 'Page_content_Document', document: any } | null,
        contentGerman?: { __typename?: 'Page_contentGerman_Document', document: any } | null
    }> | null
};

export type GetProjectsQueryVariables = Exact<{
    where: ProjectWhereInput;
}>;


export type GetProjectsQuery = {
    __typename?: 'Query',
    projects?: Array<{
        __typename?: 'Project',
        finishedAt?: any | null,
        id: string,
        link?: string | null,
        roomId?: number | null,
        game?: string | null,
        startedAt?: any | null,
        title?: string | null,
        titleGerman?: string | null,
        content?: { __typename?: 'Project_content_Document', document: any } | null,
        contentGerman?: { __typename?: 'Project_contentGerman_Document', document: any } | null,
        mainImage?: { __typename?: 'ImageFieldOutput', url: string } | null,
        shortDescription?: { __typename?: 'Project_shortDescription_Document', document: any } | null,
        shortDescriptionGerman?: { __typename?: 'Project_shortDescriptionGerman_Document', document: any } | null
    }> | null
};

export type GetProjectRestrictedQueryVariables = Exact<{
    where: ProjectWhereInput;
}>;


export type GetProjectRestrictedQuery = {
    __typename?: 'Query',
    projects?: Array<{
        __typename?: 'Project',
        unlockContent?: { __typename?: 'Project_unlockContent_Document', document: any } | null,
        unlockContentGerman?: { __typename?: 'Project_unlockContentGerman_Document', document: any } | null
    }> | null
};


export const GetPostsDocument = {
    "kind": "Document", "definitions": [{
        "kind": "OperationDefinition",
        "operation": "query",
        "name": {"kind": "Name", "value": "getPosts"},
        "variableDefinitions": [{
            "kind": "VariableDefinition",
            "variable": {"kind": "Variable", "name": {"kind": "Name", "value": "orderBy"}},
            "type": {
                "kind": "NonNullType",
                "type": {
                    "kind": "ListType",
                    "type": {
                        "kind": "NonNullType",
                        "type": {"kind": "NamedType", "name": {"kind": "Name", "value": "PostOrderByInput"}}
                    }
                }
            }
        }, {
            "kind": "VariableDefinition",
            "variable": {"kind": "Variable", "name": {"kind": "Name", "value": "take"}},
            "type": {"kind": "NamedType", "name": {"kind": "Name", "value": "Int"}}
        }, {
            "kind": "VariableDefinition",
            "variable": {"kind": "Variable", "name": {"kind": "Name", "value": "skip"}},
            "type": {"kind": "NonNullType", "type": {"kind": "NamedType", "name": {"kind": "Name", "value": "Int"}}}
        }],
        "selectionSet": {
            "kind": "SelectionSet", "selections": [{
                "kind": "Field",
                "name": {"kind": "Name", "value": "posts"},
                "arguments": [{
                    "kind": "Argument",
                    "name": {"kind": "Name", "value": "orderBy"},
                    "value": {"kind": "Variable", "name": {"kind": "Name", "value": "orderBy"}}
                }, {
                    "kind": "Argument",
                    "name": {"kind": "Name", "value": "take"},
                    "value": {"kind": "Variable", "name": {"kind": "Name", "value": "take"}}
                }, {
                    "kind": "Argument",
                    "name": {"kind": "Name", "value": "skip"},
                    "value": {"kind": "Variable", "name": {"kind": "Name", "value": "skip"}}
                }],
                "selectionSet": {
                    "kind": "SelectionSet",
                    "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "id"}}, {
                        "kind": "Field",
                        "name": {"kind": "Name", "value": "title"}
                    }, {"kind": "Field", "name": {"kind": "Name", "value": "titleGerman"}}, {
                        "kind": "Field",
                        "name": {"kind": "Name", "value": "content"},
                        "selectionSet": {
                            "kind": "SelectionSet",
                            "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "document"}}]
                        }
                    }, {
                        "kind": "Field",
                        "name": {"kind": "Name", "value": "contentGerman"},
                        "selectionSet": {
                            "kind": "SelectionSet",
                            "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "document"}}]
                        }
                    }, {"kind": "Field", "name": {"kind": "Name", "value": "createdAt"}}, {
                        "kind": "Field",
                        "name": {"kind": "Name", "value": "tags"},
                        "selectionSet": {
                            "kind": "SelectionSet",
                            "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "id"}}, {
                                "kind": "Field",
                                "name": {"kind": "Name", "value": "name"}
                            }]
                        }
                    }]
                }
            }]
        }
    }]
} as unknown as DocumentNode<GetPostsQuery, GetPostsQueryVariables>;
export const GetPagesDocument = {
    "kind": "Document", "definitions": [{
        "kind": "OperationDefinition",
        "operation": "query",
        "name": {"kind": "Name", "value": "getPages"},
        "variableDefinitions": [{
            "kind": "VariableDefinition",
            "variable": {"kind": "Variable", "name": {"kind": "Name", "value": "where"}},
            "type": {
                "kind": "NonNullType",
                "type": {"kind": "NamedType", "name": {"kind": "Name", "value": "PageWhereInput"}}
            }
        }],
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{
                "kind": "Field",
                "name": {"kind": "Name", "value": "pages"},
                "arguments": [{
                    "kind": "Argument",
                    "name": {"kind": "Name", "value": "where"},
                    "value": {"kind": "Variable", "name": {"kind": "Name", "value": "where"}}
                }],
                "selectionSet": {
                    "kind": "SelectionSet",
                    "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "id"}}, {
                        "kind": "Field",
                        "name": {"kind": "Name", "value": "name"}
                    }, {"kind": "Field", "name": {"kind": "Name", "value": "title"}}, {
                        "kind": "Field",
                        "name": {"kind": "Name", "value": "titleGerman"}
                    }, {
                        "kind": "Field",
                        "name": {"kind": "Name", "value": "content"},
                        "selectionSet": {
                            "kind": "SelectionSet",
                            "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "document"}}]
                        }
                    }, {
                        "kind": "Field",
                        "name": {"kind": "Name", "value": "contentGerman"},
                        "selectionSet": {
                            "kind": "SelectionSet",
                            "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "document"}}]
                        }
                    }]
                }
            }]
        }
    }]
} as unknown as DocumentNode<GetPagesQuery, GetPagesQueryVariables>;
export const GetProjectsDocument = {
    "kind": "Document", "definitions": [{
        "kind": "OperationDefinition",
        "operation": "query",
        "name": {"kind": "Name", "value": "getProjects"},
        "variableDefinitions": [{
            "kind": "VariableDefinition",
            "variable": {"kind": "Variable", "name": {"kind": "Name", "value": "where"}},
            "type": {
                "kind": "NonNullType",
                "type": {"kind": "NamedType", "name": {"kind": "Name", "value": "ProjectWhereInput"}}
            }
        }],
        "selectionSet": {
            "kind": "SelectionSet", "selections": [{
                "kind": "Field",
                "name": {"kind": "Name", "value": "projects"},
                "arguments": [{
                    "kind": "Argument",
                    "name": {"kind": "Name", "value": "where"},
                    "value": {"kind": "Variable", "name": {"kind": "Name", "value": "where"}}
                }],
                "selectionSet": {
                    "kind": "SelectionSet",
                    "selections": [{
                        "kind": "Field",
                        "name": {"kind": "Name", "value": "content"},
                        "selectionSet": {
                            "kind": "SelectionSet",
                            "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "document"}}]
                        }
                    }, {
                        "kind": "Field",
                        "name": {"kind": "Name", "value": "contentGerman"},
                        "selectionSet": {
                            "kind": "SelectionSet",
                            "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "document"}}]
                        }
                    }, {"kind": "Field", "name": {"kind": "Name", "value": "finishedAt"}}, {
                        "kind": "Field",
                        "name": {"kind": "Name", "value": "id"}
                    }, {"kind": "Field", "name": {"kind": "Name", "value": "link"}}, {
                        "kind": "Field",
                        "name": {"kind": "Name", "value": "mainImage"},
                        "selectionSet": {
                            "kind": "SelectionSet",
                            "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "url"}}]
                        }
                    }, {
                        "kind": "Field",
                        "name": {"kind": "Name", "value": "shortDescription"},
                        "selectionSet": {
                            "kind": "SelectionSet",
                            "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "document"}}]
                        }
                    }, {
                        "kind": "Field",
                        "name": {"kind": "Name", "value": "shortDescriptionGerman"},
                        "selectionSet": {
                            "kind": "SelectionSet",
                            "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "document"}}]
                        }
                    }, {"kind": "Field", "name": {"kind": "Name", "value": "roomId"}}, {
                        "kind": "Field",
                        "name": {"kind": "Name", "value": "game"}
                    }, {"kind": "Field", "name": {"kind": "Name", "value": "startedAt"}}, {
                        "kind": "Field",
                        "name": {"kind": "Name", "value": "title"}
                    }, {"kind": "Field", "name": {"kind": "Name", "value": "titleGerman"}}]
                }
            }]
        }
    }]
} as unknown as DocumentNode<GetProjectsQuery, GetProjectsQueryVariables>;
export const GetProjectRestrictedDocument = {
    "kind": "Document", "definitions": [{
        "kind": "OperationDefinition",
        "operation": "query",
        "name": {"kind": "Name", "value": "getProjectRestricted"},
        "variableDefinitions": [{
            "kind": "VariableDefinition",
            "variable": {"kind": "Variable", "name": {"kind": "Name", "value": "where"}},
            "type": {
                "kind": "NonNullType",
                "type": {"kind": "NamedType", "name": {"kind": "Name", "value": "ProjectWhereInput"}}
            }
        }],
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{
                "kind": "Field",
                "name": {"kind": "Name", "value": "projects"},
                "arguments": [{
                    "kind": "Argument",
                    "name": {"kind": "Name", "value": "where"},
                    "value": {"kind": "Variable", "name": {"kind": "Name", "value": "where"}}
                }],
                "selectionSet": {
                    "kind": "SelectionSet",
                    "selections": [{
                        "kind": "Field",
                        "name": {"kind": "Name", "value": "unlockContent"},
                        "selectionSet": {
                            "kind": "SelectionSet",
                            "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "document"}}]
                        }
                    }, {
                        "kind": "Field",
                        "name": {"kind": "Name", "value": "unlockContentGerman"},
                        "selectionSet": {
                            "kind": "SelectionSet",
                            "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "document"}}]
                        }
                    }]
                }
            }]
        }
    }]
} as unknown as DocumentNode<GetProjectRestrictedQuery, GetProjectRestrictedQueryVariables>;