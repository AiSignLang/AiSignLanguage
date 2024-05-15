class FriendService{

    public async getFriends(){
        //const response = await fetch('http://localhost:3000/friends');
        //
        // return response.json();

        return [
            {
                friendID: 1,
                name: 'John Doe',
                score: 100,
            },
            {
                friendID: 2,
                name: 'Jane Smith',
                score: 120,
            },
            {
                friendID: 3,
                name: 'Bob Johnson',
                score: 80,
            },
            {
                friendID: 4,
                name: 'Alice Williams',
                score: 150,
            },
            {
                friendID: 5,
                name: 'Charlie Brown',
                score: 90,
            }
        ];
    }
}


export const friendService = new FriendService();