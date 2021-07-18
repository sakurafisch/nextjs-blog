import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import remark from 'remark';
import html from 'remark-html';

const postsDirectory = path.join(process.cwd(), 'posts');

export function getSortedPostsData() {
    const fileNames = fs.readdirSync(postsDirectory);
    // console.log(fileNames)
    const allPostsData = fileNames.map(fileName => {
        
        // Remove ".md" from file name to get id
        const id = fileName.replace(/\.md$/, '');
        // console.log(id)
        // Read markdown file as string
        const fullpath = path.join(postsDirectory, fileName);
        // console.log(fullpath)
        const fileContents = fs.readFileSync(fullpath, 'utf-8');
        // console.log(fileContents)
        // Use gray-matter to parse the post metadata section
        const matterResult = matter(fileContents);
        // console.log(matterResult)

        return {
            id,
            ...(matterResult.data as { date: string, title: string})
        };
    });

    // Sort posts by date
    return allPostsData.sort((a, b) => {
        if (a.date < b.date) {
            return 1;
        } else {
            return -1;
        }
    });
}


// 返回的每个 object 必须具有 params key，
// 并且在其中包含 id key，因为在 pages/posts/[id].js 中用到
// 否则 getStaticPaths 会失败
export function getAllPostIds() {
    const fileNames = fs.readdirSync(postsDirectory);
    return fileNames.map(fileName => {
        return {
            params: {
                id: fileName.replace(/\.md$/, '')
            }
        };
    });
}


export async function getPostData(id: string) {
    const fullpath = path.join(postsDirectory, `${id}.md`);
    const fileContents = fs.readFileSync(fullpath, 'utf8');
    const matterResult = matter(fileContents);
    const processedContent = await remark()
        .use(html)
        .process(matterResult.content);
    const contentHtml = processedContent.toString();
    return {
        id,
        contentHtml,
        ...matterResult.data
    };
}