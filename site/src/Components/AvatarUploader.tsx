
function AvatarUploader() {
    
    return (
        <>
            <h1>File Upload</h1>
            <form action="http://localhost:3000/api/avatar" method="POST" encType="multipart/form-data">
                <input type="file" name="file" required/>
                <button type="submit" onClick={()=>{
                    alert("File uploaded");
                }}>Upload</button>
            </form>
        </>
    );
}

export default AvatarUploader;