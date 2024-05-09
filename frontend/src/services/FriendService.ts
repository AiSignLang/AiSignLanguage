class FriendService{

    public async getFriends(){
        const response = await fetch('http://localhost:3000/friends');
        return response.json();
    }
}


export const friendService = new FriendService();