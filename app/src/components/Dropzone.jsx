import React, { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import styled from 'styled-components'

const Wrapper = styled.div`
  padding: 10px;
  border-radius: 5px;
  text-align: center;
  cursor: ${(props) => (props.disabled ? 'not-allowed' : 'pointer')};
`

const Dropzone = ({
  text = '',
  onUpload,
  max = 1,
  accept,
  className,
  onRemove,
  disabled = false
}) => {
  const [files, setFiles] = useState(null)
  const onDrop = useCallback((acceptedFiles) => {
    // Do something with the files
    if (acceptedFiles) {
      const trimmedFiles = acceptedFiles.splice(0, max)
      onUpload(trimmedFiles)
      setFiles(trimmedFiles)
    } else {
      setFiles(null)
    }
  }, [])
  const { getRootProps, getInputProps } = useDropzone({ onDrop })
  return (
    <div>
      <Wrapper
        {...getRootProps()}
        className={className || (disabled ? 'btn btn-secondary' : 'btn btn-primary')}
        title={files && files.length ? files.map((file) => file.name).join(', ') : null}
      >
        {files ? (
          <div onClick={() => {
            setFiles(null)
            onRemove()
          }}>Remove image</div>
        ) : (
          <>
            <input
              {...getInputProps(
                accept
                  ? {
                    type: 'file',
                    multiple: max > 1,
                    accept
                  }
                  : {
                    type: 'file',
                    multiple: max > 1
                  }
              )}
            />
            <div>{text}</div>
          </>
        )}
      </Wrapper>
    </div>
  )
}

export default Dropzone
