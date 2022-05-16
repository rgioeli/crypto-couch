import styled from "styled-components";

const NewsArea = () => {
  return <NewsAreaWrapper>News Area Wrapper</NewsAreaWrapper>;
};

export const getStaticProps = async (ctx) => {
  return {
    props: {
      data: null,
    },
  };
};

const NewsAreaWrapper = styled.div`
  flex: 1;
  max-width: 300px;
`;

export default NewsArea;
