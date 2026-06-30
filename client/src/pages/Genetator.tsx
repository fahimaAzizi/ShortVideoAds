import React, { useState } from "react"
import Title from "../components/Title"
import UploadZone from "../components/UploadZone"


const Genetator = () => {

  const [productImage, setProductImage] = useState<File | null>(null)
  const [modelImage, setModelImage] = useState<File | null>(null)

  const handleGenerate = async (e: React.FormEvent<HTMLFormElement>)=>{
    e.preventDefault()
  }


   return (
    <div className="min-h-screen text-white p-6 md:p-12 mt-28">
      <form className="max-w-4xl mx-auto mb-40" onSubmit={handleGenerate}>
        <Title
          heading="Create In-Context Image"
          description="Upload your model and product images to generate stunning UGC, short-form videos and social media posts"
        />

        <div className="flex gap-20 max-sm:flex-col items-start justify-between">
          {/* left col */}
          <div className="flex flex-col w-full sm:max-w-60 gap-8 mt-8 mb-12">
    <UploadZone file={productImage} onClear={() => setProductImage(null)} onChange={(file) => setProductImage(file)}/>
             <UploadZone file={modelImage} onClear={() => setModelImage(null)} onChange={(file) => setModelImage(file)}/>
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
