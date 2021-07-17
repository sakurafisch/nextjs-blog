import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const postsDirectory = path.join(process.cwd(), 'posts');

export function getSortedPostsData() {
    const fileNames = fs.readdirSync(postsDirectory);
    console.log(fileNames)
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
            ...matterResult.data
        };
    });

    // Sort posts by date
    return allPostsData.sort(({ data: a }, { date: b }) => {
        if (a < b) {
            return 1;
        } else if (a > b) {
            return -1;
        } else {
            return 0;
        }
    });
}