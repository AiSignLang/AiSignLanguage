
class FriendService{

    // TODO: correct fetchRestEndpoint

    public async getFriends(){
        //const response = await fetchRestEndpoint('http://localhost:5000/friends', 'GET');

        //const friends = await response.json();
        /*return [
            {friendID: 1, scoreID: 1},
            {friendID: 2, scoreID: 2},
            {friendID: 3, scoreID: 3},
            {friendID: 4, scoreID: 4},
            {friendID: 5, scoreID: 5},
            {friendID: 6, scoreID: 6}
        ]

         */

        return [
            {
                name: 'Max Mustermann',
                profilePicture: 'https://www.w3schools.com/howto/img_avatar.png',
                score:100
            },
            {
                name: 'John Doe',
                profilePicture: 'https://www.w3schools.com/howto/img_avatar2.png',
                score:80
            },
            {
                name: 'Jane Smith',
                profilePicture: 'https://www.w3schools.com/howto/img_avatar3.png',
                score:90
            },
            {
                name: 'Emma Johnson',
                profilePicture: 'https://www.w3schools.com/howto/img_avatar4.png',
                score:95
            },
            {
                name: 'Robert Brown',
                profilePicture: 'https://www.w3schools.com/howto/img_avatar5.png',
                score:85
            }
        ]
    }

    public async addFriend(friend: null){
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

    public async deleteFriend(id: null){
        const response = await fetch(`http://localhost:5000/friends/${id}`, {
            method: 'DELETE'
        });
        const deletedFriend = await response.json();
        return deletedFriend;
    }
}

export const friendService = new FriendService();