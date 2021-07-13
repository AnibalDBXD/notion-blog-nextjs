import { renderBlocks, renderTitle } from '@9gustin/react-notion-render';
import { GetStaticPaths, GetStaticProps } from 'next';
import { getDatabase, getPage, getBlocks } from '../lib/notion';
import ArticleWrapper from '../components/ArticleWrapper';

import { databaseId } from '.';

export default function Post({ page, blocks }): JSX.Element {
  if (!page || !blocks) {
    return <div />;
  }

  return (
    <ArticleWrapper {...page} title={renderTitle(page.properties.Name)}>
      {renderBlocks(blocks)}
    </ArticleWrapper>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const database = await getDatabase(databaseId);
  return {
    paths: database.map((page) => ({ params: { id: page.id } })),
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps = async (context) => {
  const { id } = context.params;
  const page = await getPage(id);
  const blocks = await getBlocks(id);

  // Retrieve block children for nested blocks (one level deep), for example toggle blocks
  // https://developers.notion.com/docs/working-with-page-content#reading-nested-blocks
  const childBlocks = await Promise.all(
    blocks
      .filter((block) => block.has_children)
      .map(async (block) => ({
        id: block.id,
        children: await getBlocks(block.id),
      })),
  );
  const blocksWithChildren = blocks.map((block) => {
    // Add child blocks if the block should contain children but none exists
    if (block.has_children && !block[block.type].children) {
      // eslint-disable-next-line no-param-reassign
      block[block.type].children = childBlocks.find(
        (x) => x.id === block.id,
      )?.children;
    }
    return block;
  });

  return {
    props: {
      page,
      blocks: blocksWithChildren,
    },
    revalidate: 1,
  };
};
