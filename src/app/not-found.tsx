import Image from 'next/image';

import SocialCard from '@/components/cards/SocialCard';
import Container from '@/components/layout/Container';
import LinksRedirectArrow from '@/components/links/LinksRedirectArrow';

const NotFound = () => {
  return (
    <Container className='min-h-screen flex flex-col items-center space-y-6 px-4 py-5'>
      <div className='space-y-1'>
        <p className='font-dm_sans text-center sm:text-left text-brand-orange'>
          Page Not Found
        </p>

        <p className='font-arvo text-3xl md:text-5xl text-center sm:text-left text-text-light dark:text-text-dark'>
          Lost your path?
        </p>
      </div>

      <LinksRedirectArrow link='/feed' position='Left'>
        <p className='font-roboto'>Go back to home</p>
      </LinksRedirectArrow>

      <div className='w-full sm:w-4/5 md:w-1/2 space-y-2'>
        <SocialCard
          icon='RiDiscord'
          title='Join our Discord'
          text='Connect with fellow enthusiasts and stay updated.'
          link='https://discord.gg/6fK9YuV8FV'
        />

        <SocialCard
          icon='RiGithub'
          title='Explore on GitHub'
          text=' Explore our repositories and be part of the collaboration.'
          link='https://github.com/the-monkeys'
        />

        <SocialCard
          icon='RiTwitterX'
          title='Follow us on X'
          text='Stay in the loop with the latest updates.'
          link='https://twitter.com/TheMonkeysLife'
        />
      </div>
    </Container>
  );
};

export default NotFound;
