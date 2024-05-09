class FriendService{

    // TODO: correct fetchRestEndpoint

    async getFriends(){
        const response = await fetchRestEndpoint('http://localhost:5000/friends', 'GET');
        const friends = await response.json();
        return friends;
    }

    async addFriend(friend: null){
        const response = await fetch('http://localhost:5000/friends', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(friend)
        });
        const newFriend = await response.json();
        return newFriend;
    }

    async deleteFriend(id: null){
        const response = await fetch(`http://localhost:5000/friends/${id}`, {
            method: 'DELETE'
        });
        const deletedFriend = await response.json();
        return deletedFriend;
    }
}

export const friendService = new FriendService();