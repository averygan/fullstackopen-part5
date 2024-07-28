const BlogForm = ({
    handleBlogChange,
    handleAddBlog,
    title,
    author,
    url
    }) => { 
    return (
        <div>
        <h2>create new</h2>
        <form onSubmit={handleAddBlog}>
            <div>
            title:
            <input type ="text" value={title} name="title" onChange={handleBlogChange}/>
            </div>
            <div>
            author:
            <input type ="text" value={author} name="author" onChange={handleBlogChange}/>
            </div>
            <div>
            url:
            <input type ="text" value={url} name="url" onChange={handleBlogChange}/>
            </div>
            <button type="submit">create</button>
        </form>
        </div>
    )
}

export default BlogForm