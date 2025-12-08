import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import type { FileWithPath } from 'react-dropzone'
import { Button } from '../ui/button'

type FileUploaderProps = {
    fieldChange: (FILES: File[]) => void;
    mediaUrl: string;
}


const FileUploader = ({ fieldChange, mediaUrl: _mediaUrl }: FileUploaderProps) => {
    const [file, setFile] = useState<File[]>([]);
    const [fileUrl, setFileUrl] = useState('');

    const onDrop = useCallback(
        (acceptedFiles: FileWithPath[]) => {
            setFile(acceptedFiles);
            fieldChange(acceptedFiles);
            setFileUrl(URL.createObjectURL(acceptedFiles[0]));
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [file]);


    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        accept: {
            'image/*': ['.png', '.jpeg', '.jpg', '.svg']
        }
    })

    return (
        <div {...getRootProps()} className='flex justify-center items-center flex-col bg-input/30 border border-border rounded-2xl cursor-pointer'>
            <input {...getInputProps()} className='cursor-pointer' />
            {
                fileUrl ? (

                    <>

                        <div className='flex flex-1 justify-center w-full p-5 lg:p-10'>
                            <img
                                src={fileUrl}
                                alt="uploaded-file"
                                className='h-80 lg:h-[480px] w-full rounded-3xl object-cover object-top' />
                        </div>
                        <p className='text-center small-regular w-full p-4 border-t border-t-accent'>Click or drag photo to replace</p>
                    </>
                ) : (
                    <div className='flex items-center justify-center flex-col p-4 h-80 lg:h-[612px]'>
                        <img src="/assets/icons/file-upload.svg"
                            alt="file-upload"
                            width={96}
                            height={77}

                        />
                        <h3 className='text-[16px] font-medium leading-[140%]  mb-1 mt-6 text-foreground/80 '> Drag Photo here..</h3>
                        <p className='text-foreground/40 mb-6 '>JPG</p>

                        <Button variant='secondary' className='h-10 bg-input px-5 text-foreground/80 flex'>
                            Select From Computer
                        </Button>
                    </div>
                )
            }
        </div>
    )
}

export default FileUploader
