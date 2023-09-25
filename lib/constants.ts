export interface server{
    socket_url : string,
    name: string,
    isOwner: string,
    inviteCode: string,
    users: {
        userId:string,
        name: string,
        profileImageUrl: string,
        servers: string,
      }[]
}
