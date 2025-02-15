/* eslint-disable camelcase */
import Text from '@9gustin/react-notion-render/dist/types/Text';

export interface ITag {
    id: string;
    multi_select: {
    color: string;
    id: string;
    name: string
    }[]
}

export interface IPost {
    id: string;
    last_edited_time: string;
    properties: {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      Name: any,
      Tags: ITag
      Image: {
        url: string
      },
      JaponeseName: {
        rich_text: Text[]
      },
      Stars: {
        number: number
      }
    };
}
