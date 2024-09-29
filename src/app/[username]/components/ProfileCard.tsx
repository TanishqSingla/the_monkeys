'use client';

import { FC } from 'react';

import Link from 'next/link';
import { notFound, useParams } from 'next/navigation';

import Icon from '@/components/icon';
import ProfileImage from '@/components/profileImage';
import { ProfileCardSkeleton } from '@/components/skeletons/profileSkeleton';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useToast } from '@/components/ui/use-toast';
import useUser from '@/hooks/useUser';
import moment from 'moment';
import { useSession } from 'next-auth/react';

import EditTopics from './EditTopics';
import TopicSelector from './FollowTopicsDialog';

const ProfileCard: FC = () => {
  const { toast } = useToast();

  const params = useParams<{ username: string }>();

  const { data, status } = useSession();

  const { user, isLoading, isError, mutate } = useUser(params.username);

  if (isError) {
    notFound();
  }

  const copyToClipboard = (text: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).then(
        () => {
          toast({
            variant: 'default',
            title: 'Username Copied',
            description: 'The username has been copied to the clipboard.',
          });
        },
        () => {
          toast({
            variant: 'error',
            title: 'Copy Failed',
            description: 'Unable to copy the username.',
          });
        }
      );
    }
  };

  if (isLoading) {
    return <ProfileCardSkeleton />;
  }

  const joinedDate = user?.created_at
    ? moment.unix(user?.created_at.seconds).format('MMMM, YYYY')
    : 'Date not available';

  return (
    <div className='space-y-2'>
      <div className='flex items-end gap-2 flex-wrap'>
        <div className='rounded-lg size-32 ring-1 ring-secondary-lightGrey/25 flex items-center justify-center overflow-hidden'>
          {user?.username && <ProfileImage username={user.username} />}
        </div>

        <div>
          <h1 className='font-playfair_Display font-semibold text-2xl capitalize cursor-default'>{`${user?.first_name} ${user?.last_name}`}</h1>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger
                className='text-primary-monkeyOrange hover:opacity-75'
                onClick={() => copyToClipboard(user?.username || '')}
              >
                <p className='font-jost'>{`@${user?.username}`}</p>
              </TooltipTrigger>

              <TooltipContent className='text-sm'>Copy Username</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      {user?.bio && (
        <p className='font-jost text-lg leading-tight cursor-default break-words'>
          {user.bio}
        </p>
      )}

      <div className='cursor-default'>
        {user?.address && (
          <p className='font-jost'>
            <span>
              <Icon name='RiMapPin' size={18} className='inline-block mr-2' />
            </span>
            {user.address}
          </p>
        )}

        <p className='font-jost'>
          <span>
            <Icon name='RiCalendar' size={18} className='inline-block mr-2' />
          </span>
          Joined {joinedDate}
        </p>
      </div>

      <div className='py-1 flex gap-4'>
        {user?.twitter && (
          <Link
            target='_blank'
            title='Twitter'
            href={`https://x.com/${user.twitter}`}
            className='opacity-75 hover:opacity-100'
          >
            <Icon name='RiTwitterX' type='Fill' />
          </Link>
        )}

        {user?.github && (
          <Link
            target='_blank'
            title='Github'
            href={`https://github.com/${user.github}/`}
            className='opacity-75 hover:opacity-100'
          >
            <Icon name='RiGithub' type='Fill' />
          </Link>
        )}

        {user?.linkedin && (
          <Link
            target='_blank'
            title='Linkedin'
            href={`https://www.linkedin.com/in/${user.linkedin}`}
            className='opacity-75 hover:opacity-100'
          >
            <Icon name='RiLinkedin' type='Fill' />
          </Link>
        )}

        {user?.instagram && (
          <Link
            target='_blank'
            title='Instagram'
            href={`https://www.instagram.com/${user.instagram}/`}
            className='opacity-75 hover:opacity-100'
          >
            <Icon name='RiInstagram' type='Fill' />
          </Link>
        )}
      </div>

      <div className='my-4'>
        <h2 className='text-lg font-semibold  mb-4'>My Topics</h2>
        <div className='flex flex-wrap gap-2 mb-4'>
          {user &&
            user.topics?.map((topic: string, index: number) => (
              <span
                key={index}
                className='bg-secondary-lightGrey  rounded-xl px-3 py-1 text-sm font-medium'
              >
                {topic}
              </span>
            ))}
        </div>
        {data?.user.username === params.username &&
          status === 'authenticated' && (
            <>
              <button className='text-red-500 hover:underline'>
                Add More topics
              </button>
            </>
          )}
      </div>
    </div>
  );
};

export default ProfileCard;
