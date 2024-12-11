import type { Metadata } from 'next';

import { ContributeAndSponsorCard } from '@/components/branding/sponsor/ContributeAndSponsorCard';
import Container from '@/components/layout/Container';
import { SearchInput } from '@/components/search/SearchInput';

export const metadata: Metadata = {
  title: 'Feed',
};

const BlogFeedPageLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <Container className='grid grid-cols-3 gap-6 sm:gap-4 md:gap-6 px-5 py-4 pb-12'>
      <div className='min-h-screen col-span-3 md:col-span-2 order-2 md:order-1'>
        {children}
      </div>

      <div className='h-fit col-span-3 md:col-span-1 order-1 md:order-2'>
        <ContributeAndSponsorCard className='mb-2' />

        <SearchInput />
      </div>
    </Container>
  );
};

export default BlogFeedPageLayout;