import { SimpleGrid } from '@chakra-ui/react';
import { useState } from 'react';
import { IPost } from '../../interfaces/types';
import FilterPosts from '../FilterPosts';
import Post from '../Post';

  interface IProps {
      posts: IPost[];
      haveContent?: boolean
  }

function PostGrid({ posts, haveContent }: IProps): JSX.Element {
  const [currentPosts, setCurrentPosts] = useState(posts);

  const setPosts = (newPosts: IPost[]): void => setCurrentPosts(newPosts);
  return (
    <>
      <FilterPosts posts={posts} setPosts={setPosts} />
      <SimpleGrid as="ul" columns={[1, 1, 2, 3]} gridGap="4rem" style={{ listStyle: 'none ' }}>
        {currentPosts.map((post) => (
          <li key={post.id}>
            <Post key={post.id} haveContent={haveContent} {...post} />
          </li>
        ))}
      </SimpleGrid>
    </>
  );
}

export default PostGrid;
