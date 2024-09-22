'use client';

import React, {
  Suspense,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';

import { EditorProps } from '@/components/editor';
import Icon from '@/components/icon';
import { Loader } from '@/components/loader';
import PublishModal from '@/components/modals/publish/PublishModal';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import axiosInstance from '@/services/api/axiosInstance';
import { OutputData } from '@editorjs/editorjs';
import { useSession } from 'next-auth/react';

// Dynamically import the Editor component to avoid server-side rendering issues
const Editor = dynamic(() => import('@/components/editor'), {
  ssr: false,
});

// Initial data structure for the editor
const initial_data = {
  time: new Date().getTime(),
  blocks: [],
};

const CreatePage = () => {
  // State to manage the editor component
  const [editor, setEditor] = useState<React.FC<EditorProps> | null>(null);
  // State to manage the editor data
  const [data, setData] = useState<OutputData>(initial_data);
  // State to manage the visibility of the publish modal
  const [showModal, setShowModal] = useState<boolean>(false);
  // State to manage the WebSocket connection
  const [webSocket, setWebSocket] = useState<WebSocket | null>(null);
  // State to manage the saving status
  const [isSaving, setIsSaving] = useState<boolean>(false);
  // Get the session data
  const { data: session } = useSession();
  const authToken = session?.user.token;
  const router = useRouter();

  // Use useRef to store the blog ID
  const blogIdRef = useRef<string>(Math.random().toString(36).substring(7));
  const blogId = blogIdRef.current;

  // Function to create and manage WebSocket connection
  const createWebSocket = useCallback((blogId: string, token: string) => {
    const ws = new WebSocket(
      `wss://dev.themonkeys.site/api/v1/blog/draft/${blogId}?token=${token}`
    );

    ws.onopen = () => {
      console.log('WebSocket connection opened');
    };

    ws.onmessage = (event) => {
      console.log('WebSocket message received:', event.data);
      setIsSaving(false); // Reset saving status when message is received
    };

    ws.onclose = () => {
      console.log('WebSocket connection closed');
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    setWebSocket(ws);

    // Cleanup function to close the WebSocket connection
    return () => {
      ws.close();
    };
  }, []);

  // Function to format data before sending it to the server
  const formatData = useCallback(
    (data: OutputData, accountId: string | undefined) => {
      return {
        owner_account_id: accountId,
        author_list: [accountId],
        content_type: 'editorjs',
        blog: {
          time: data.time,
          blocks: data.blocks.map((block) => ({
            ...block,
            author: [accountId],
            time: new Date().getTime(),
          })),
        },
        tags: ['tech', 'nextjs', 'ui'],
      };
    },
    []
  );

  // Load the Editor component dynamically
  useEffect(() => {
    const loadEditor = async () => {
      const module = await import('@/components/editor');
      setEditor(() => module.default);
    };

    loadEditor();
  }, []);

  // Create WebSocket connection when authToken is available
  useEffect(() => {
    if (authToken) {
      const cleanup = createWebSocket(blogId, authToken);

      // Listen for beforeunload event to close the WebSocket connection
      const handleBeforeUnload = () => {
        cleanup();
      };

      window.addEventListener('beforeunload', handleBeforeUnload);

      return () => {
        cleanup();
        window.removeEventListener('beforeunload', handleBeforeUnload);
      };
    }
  }, [authToken, blogId, createWebSocket]);

  // Handle the publish action
  const handlePublishStep = useCallback(() => {
    const formattedData = formatData(data, session?.user.account_id);

    axiosInstance
      .post(`/blog/publish/${blogId}`, formattedData)
      .then((res) => {
        console.log(res);
        toast({
          variant: 'success',
          title: 'Blog Published successfully',
          description: 'success',
        });
        router.push(`/`);
      })
      .catch((err) => {
        console.log(err);
        toast({
          variant: 'destructive',
          title: 'Error publishing blog',
          description: 'error',
        });
      });
  }, [data, session?.user.account_id, blogId, formatData, router]);

  // Send data to WebSocket when data changes
  useEffect(() => {
    if (webSocket && webSocket.readyState === WebSocket.OPEN) {
      const formattedData = formatData(data, session?.user.account_id);
      webSocket.send(JSON.stringify(formattedData));
      setIsSaving(true); // Set saving status when data is sent
    }
  }, [data, webSocket, session?.user.account_id, formatData]);

  return (
    <div className='space-y-2'>
      <div className='flex justify-end gap-2'>
        <Button variant='ghost' onClick={() => console.log(data)}>
          Preview
        </Button>

        <Button onClick={handlePublishStep}>Publish</Button>
      </div>
      <div className='flex items-center gap-2'>
        Saving draft {isSaving ? <Loader /> : <Icon name='RiCheck' size={20} />}{' '}
      </div>
      <Suspense fallback={<Loader />}>
        {editor && <Editor data={data} onChange={setData} />}
      </Suspense>
      {showModal && <PublishModal setModal={setShowModal} />}
    </div>
  );
};

export default CreatePage;
