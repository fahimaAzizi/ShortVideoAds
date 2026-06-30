import React, { useState } from "react"
import Title from "../components/Title"
import UploadZone from "../components/UploadZone"


const Genetator = () => {

  const [name, setName] = useState('')
  const [productName, setProductName] = useState('')
  const [productDescription, setProductDescription] =useState('9:16')
  const [ aspectRatio, setAspectRatio] = useState<File | null>(null)
  const [productImage, setProductImage] = useState<File | null>(null)
  const [userPrompt , setUserPrompt] = useState('')
  const [isGenerating, setIsGenerating] = useState('')
  const [modelImage , setModelImage]

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type:'prodect' | 'model')=>{
    if(e.target.files && e.target.files[0]){
      if(type === 'product') setProductImage(e.target.files[0]);
      else setModelImage(e.target.files[0])
    }
  }

  const handleGenerate = async (e: React.FormEvent<HTMLFormElement>)



   return (
    <div className="min-h-screen text-white p-6 md:p md:p-12 mt-28">
      <form className="max-w-4xl mx-auto mb-40" onSubmit={handleGenerate}>
        <Title
          heading="Create In-Context Image"
          description="Upload your model and product images to generate stunning UGC, short-form videos and social media posts"
        />

        <div className="flex gap-20 max-sm:flex-col items-start justify-between">
          {/* left col */}
          <div className="flex flex-col w-full sm:max-w-60 gap-8 mt-8 mb-12">
            <UploadZone label="produdt image" file={} onClear={} onChange={}/>
          </div>

          {/* right col */}
          <div>
            <p>Right Col</p>
          </div>
        </div>
      </form>
    </div>
  )
}

export default Genetator