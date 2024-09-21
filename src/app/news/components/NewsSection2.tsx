'use client';

import Link from 'next/link';

import { NewsSectionSkeleton } from '@/components/skeletons/newsSkeleton';
import { Button } from '@/components/ui/button';
import { useGetAllNews2 } from '@/hooks/useGetAllNews';
import { NewsSource2 } from '@/services/news/newsTypes';

import NewsCarousel from './news/NewsCarousel';
import Section1 from './news/Section1';
import Section2 from './news/Section2';
import TopSection from './news/TopSection';

// for news source 2
// import News2Card from './News2Card';

const NewsSection = () => {
  // for news source 1
  //   const { news, isLoading, error } = useGetAllNews1();

  // for news source 2
  const { news, isLoading, error } = useGetAllNews2();

  // for news source 1
  //   const newsData = news?.data as NewsSource1[];

  // for news source 2
  const newsData = news?.articles as NewsSource2[];

  if (isLoading) return <NewsSectionSkeleton />;

  if (error)
    return (
      <p className='py-4 font-jost text-sm text-alert-red text-center'>
        Error fetching news. Try again.
      </p>
    );

  if (newsData.length >= 20) {
    return (
      <div>
        <div className='max-w-7xl mx-auto p-4 dark:border-gray-600 border border-b-0'>
          <div className='flex flex-wrap items-center gap-2 text-sm mb-4 overflow-x-auto'>
            <Button
              variant='outline'
              className='flex items-center bg-black dark:bg-white text-white dark:text-black'
            >
              Latest News
              {/* <ChevronDown className="ml-2 h-4 w-4" /> */}
            </Button>
            <div className='bg-black text-white px-3 py-1 rounded'>
              S&P 500 5,703.51 <span className='text-green-400'>▲ +1.52%</span>
            </div>
            <div className='bg-black text-white px-3 py-1 rounded'>
              Nasdaq 18,003.48 <span className='text-green-400'>▲ +2.45%</span>
            </div>
            <div className='bg-black text-white px-3 py-1 rounded'>
              US 10 Yr 3.74 <span className='text-red-400'>▼ -0.34%</span>
            </div>
            <div className='bg-black text-white px-3 py-1 rounded'>
              FTSE 100 8,312.4
            </div>
          </div>
          <hr className='border-t border-gray-300 my-4' />
          <div className='grid md:grid-cols-3 gap-4'>
            <div className='md:col-span-2'>
              <Link href={newsData[0].url} target='_blank'>
                <img
                  src={newsData[0].urlToImage}
                  alt='Skyscrapers and escalator'
                  className='w-full h-64 object-cover mb-4'
                />
                <h2 className='text-2xl font-bold mb-2'>
                  {newsData[0].source.name}
                </h2>
                <h1 className='md:text-4xl font-bold mb-2 text-2xl'>
                  {newsData[0].title}
                </h1>
              </Link>
              <p className='text-gray-600'>{newsData[0].description}...</p>
            </div>

            {/* Side Articles */}
            <div className='space-y-4'>
              <div>
                {' '}
                <Link href={newsData[1].url} target='_blank'>
                  <img
                    src={newsData[1].urlToImage}
                    alt='Police car in China'
                    className='w-full h-40 object-cover mb-2'
                  />
                  <h3 className='font-bold mb-1'>{newsData[1].title}</h3>
                </Link>
              </div>
              <hr className='border-t border-gray-300 my-4' />
              <div>
                <Link href={newsData[2].url} target='_blank'>
                  <h3 className='font-bold mb-1'>{newsData[2].title}</h3>
                </Link>
              </div>
              <hr className='border-t border-gray-300 my-4' />
              <div>
                <Link href={newsData[3].url} target='_blank'>
                  <h3 className='font-bold'>{newsData[3].title}</h3>
                </Link>
              </div>
            </div>
          </div>
          <NewsCarousel
            newsArray={[
              newsData[randomNumber(newsData.length)],
              newsData[randomNumber(newsData.length)],
              newsData[randomNumber(newsData.length)],
              newsData[randomNumber(newsData.length)],
              newsData[randomNumber(newsData.length)],
              newsData[randomNumber(newsData.length)],
            ]}
          />
          <hr className='border-t border-gray-300 my-4' />
          <div className=' flex md:flex-row overflow-hidden  max-w-full w-full'>
            <div className='w-full  hidden md:block'>
              {' '}
              <Link href={newsData[4].url} target='_blank'>
                <img
                  src={newsData[4].urlToImage}
                  alt='Market news'
                  className='object-cover h-full w-full'
                />
              </Link>
            </div>

            <div className='w-full p-4'>
              <h4 className='text-xs text-gray-500 uppercase'>
                {newsData[4].source.name}
              </h4>
              <h2 className='text-xl font-semibold'>{newsData[4].title}</h2>

              {/* Related Section */}
              <div className='mt-4 bg-gray-100 rounded-lg p-2'>
                <h5 className='text-sm font-semibold text-gray-600'>Related</h5>{' '}
                <hr className='border-t border-gray-300 my-2' />
                <ul className='mt-2 space-y-1'>
                  <Link href={newsData[5].url} target='_blank'>
                    <li className='text-blue-600 hover:underline cursor-pointer'>
                      {newsData[5].title}
                    </li>
                  </Link>
                  <hr className='border-t border-gray-300 my-2' />
                  <Link href={newsData[7].url} target='_blank'>
                    <li className='text-blue-600 hover:underline cursor-pointer'>
                      {newsData[7].title}
                    </li>
                  </Link>
                  <hr className='border-t border-gray-300 my-2' />
                  <Link href={newsData[8].url} target='_blank'>
                    <li className='text-blue-600 hover:underline cursor-pointer'>
                      {newsData[8].title}
                    </li>
                  </Link>
                  <hr className='border-t border-gray-300 my-2' />
                  <Link href={newsData[9].url} target='_blank'>
                    <li className='text-blue-600 hover:underline cursor-pointer'>
                      {newsData[9].title}
                    </li>
                  </Link>
                </ul>
              </div>
            </div>
          </div>{' '}
        </div>
      </div>
    );
  }
};

function randomNumber(length: number) {
  return Math.floor((Math.random() * length) % length);
}

export default NewsSection;
