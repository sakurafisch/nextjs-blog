import Layout from '../../components/layout';
import { getAllPostIds, getPostData } from '../../lib/posts';

export default function Post({ postData }) {
    return (
        <Layout>
            {postData.title}
            <br />
            {postData.id}
            <br />
            {postData.date}
            <div dangerouslySetInnerHTML={{ __html: postData.contentHtml }} />
        </Layout>
    );
}


// 返回 id
export async function getStaticPaths() {
    const paths = getAllPostIds();
    return {
        paths,
        fallback: false
    };
}


// 接收 id 参数，并根据 id 返回对应的 post
export async function getStaticProps({ params }) {
    const postData = await getPostData(params.id);
    return {
        props: {
            postData
        }
    };
}