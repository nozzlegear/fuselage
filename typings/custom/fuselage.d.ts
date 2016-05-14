export interface BlogPostSummary
{
    title: string;
    
    description: string;
    
    url: string;
    
    filename: string;
}

export interface BlogPost extends BlogPostSummary
{
    content: string;
}