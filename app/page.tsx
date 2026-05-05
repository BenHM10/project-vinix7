'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

export default function Page() {
  const [description, setDescription] = useState('')
  const [location, setLocation] = useState('')
  const [image, setImage] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      let imageUrl = ''

      //Upload gambar
      if (image) {
        const fileName = `${Date.now()}-${image.name}`

        const { error: uploadError } = await supabase.storage
          .from('reports-images')
          .upload(fileName, image)

        if (uploadError) {
          console.error('UPLOAD ERROR:', uploadError)
          setMessage('❌ Upload gambar gagal')
          setLoading(false)
          return
        }

        const { data } = supabase.storage
          .from('reports-images')
          .getPublicUrl(fileName)

        imageUrl = data.publicUrl
      }

      //Insert database
      const { error } = await supabase
        .from('reports')
        .insert([
          {
            description,
            location,
            image_url: imageUrl,
            status: 'submitted',
          },
        ])

      if (error) {
        console.error('DB ERROR:', error)
        setMessage('❌ Gagal kirim laporan')
      } else {
        setMessage('✅ Berhasil!')
        setDescription('')
        setLocation('')
        setImage(null)
      }
    } catch (err) {
      console.error('UNEXPECTED ERROR:', err)
      setMessage('❌ Error tidak terduga')
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-md">
        <h1 className="text-xl font-bold mb-4 text-center">
          Laporan Infrastruktur
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          <textarea
            className="w-full border p-2 rounded"
            placeholder="Deskripsi..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />

          <input
            className="w-full border p-2 rounded"
            placeholder="Lokasi..."
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
          />

          <div className="border-2 border-dashed border-blue-300 p-4 rounded-lg text-center hover:bg-blue-50 transition">
            
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files?.[0] || null)}
              className="block w-full text-sm text-gray-500"
            />

            <p className="text-sm text-gray-500 mt-2">
              Pilih gambar (opsional)
            </p>

            {image && (
              <p className="text-xs text-gray-600 mt-1">
                {image.name}
              </p>
            )}

          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-2 rounded"
            disabled={loading}
          >
            {loading ? 'Mengirim...' : 'Kirim'}
          </button>
        </form>

        {message && <p className="mt-3 text-center">{message}</p>}

        <a href="/reports" className="block text-center mt-4 text-blue-500">
          Lihat Laporan
        </a>
      </div>
    </div>
  )
}
