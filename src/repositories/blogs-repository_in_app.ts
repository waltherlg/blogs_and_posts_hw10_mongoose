
type blogType = {
    id: string,
    name: string,
    description: string,
    websiteUrl: string
}

let blogs: Array<blogType> = [
    {
        "id": "firstblog",
        "name": "name1",
        "description": "description1",
        "websiteUrl": "websiteUrl"
    },
    {
        "id": "2",
        "name": "name2",
        "description": "description2",
        "websiteUrl": "websiteUrl"
    },
    {
        "id": "3",
        "name": "name3",
        "description": "description3",
        "websiteUrl": "websiteUrl"
    }
]

export const blogsRepository = {
    async getBlogByID(id: string | null | undefined): Promise<blogType | undefined> {
        let blog = blogs.find(b => b.id === id);
        return blog

    },

    async getAllBlogs(): Promise<blogType[]> {
        return blogs
    },

    async createBlog(name: string, description: string, websiteUrl: string): Promise<blogType> {
        const newBlog: blogType = {
            "id": (+(new Date())).toString(),
            "name": name,
            "description": description,
            "websiteUrl": websiteUrl
        }
        blogs.push(newBlog)
        return newBlog
    },

    async updateBlog(id: string, name: string, description: string, websiteUrl: string): Promise<boolean>{
        let blog = blogs.find(b => b.id === id);
        if (blog) {
            blog.name = name
            blog.description = description
            blog.websiteUrl = websiteUrl
            return true
        }
        else {
            return false
        }
    },

    async deleteBlog(id: string): Promise<boolean>{
        for (let i = 0; i < blogs.length; i++){
            if (blogs[i].id === id){
                blogs.splice(i, 1);
                return true
            }
        }
        return false


    },

    async deleteAllBlogs(): Promise<boolean> {
        blogs.splice(0);
        return true
    },
}


