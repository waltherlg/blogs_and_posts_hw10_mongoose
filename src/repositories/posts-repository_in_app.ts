

type postType = {
    id: string,
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
    blogName: string
}
let posts: Array<postType> = [
    {
        "id": "firspost",
        "title": "music",
        "shortDescription": "post of music",
        "content": "content1",
        "blogId": "blogId1",
        "blogName": "Bob's trambon"
    },
    {
        "id": "2",
        "title": "title2",
        "shortDescription": "shortDescription2",
        "content": "content2",
        "blogId": "blogId2",
        "blogName": "blogName2"
    },
    {
        "id": "3",
        "title": "title3",
        "shortDescription": "shortDescription2",
        "content": "content3",
        "blogId": "blogId3",
        "blogName": "blogName3"
    },

]

export const postsRepository = {

    async getPostByID(id: string | undefined): Promise<postType | undefined> {
        const post = posts.find(p => p.id === id);
        return post
    },

    async getPostByBlogsID(blogId: string | undefined): Promise<postType | undefined> {
        const post = posts.find(p => p.blogId === blogId);
        return post
    },

    async getAllPosts() {
        return posts
    },

    async createPost(title: string, shortDescription: string, content: string, blogId: string): Promise<postType> {
        const newPost: any = {
            "id": (+(new Date())).toString(),
            "title": title,
            "shortDescription": shortDescription,
            "content": content,
            "blogId": blogId,
            "blogName": content + " " + title
        }
        posts.push(newPost)
        return newPost
    },

    async updatePost(id: string, title: string, shortDescription: string, content: string, blogId: string): Promise<boolean> {
        let post = posts.find(p => p.id === id);
        if (post) {
            post.title = title
            post.shortDescription = shortDescription
            post.content = content
            post.blogId = blogId
            return true
        }
        else {
            return false
        }
    },

    async deletePost(id: string): Promise<boolean> {
        for (let i = 0; i < posts.length; i++){
            if (posts[i].id === id){
                posts.splice(i, 1);
                return true
            }
        }
        return false
    },

    async deleteAllPosts(): Promise<boolean> {
        posts.splice(0);
        return true
    },
}