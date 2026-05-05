import { supabase } from '@/lib/supabaseClient'
import Link from 'next/link'

export default async function ReportsPage() {
  const { data } = await supabase
    .from('reports')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="min-h-screen bg-gray-100">

      {/* Navbar */}
      <div className="bg-white shadow p-4 flex justify-between">
        <h1 className="font-bold text-lg">Daftar Laporan</h1>
        <Link href="/" className="text-blue-600">
          Buat Laporan
        </Link>
      </div>

      {/* List */}
      <div className="p-6 grid md:grid-cols-2 lg:grid-cols-3 gap-6">

        {data?.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-xl shadow hover:shadow-lg transition p-4"
          >
            <p className="font-semibold mb-2">
              {item.description}
            </p>

            <p className="text-sm text-gray-500">
              📍 {item.location}
            </p>

            <p className="text-sm mt-1">
              Status: <span className="text-blue-600">{item.status}</span>
            </p>

            {item.image_url && (
              <img
                src={item.image_url}
                className="mt-3 w-full h-40 object-cover rounded"
              />
            )}

            <p className="text-xs text-gray-400 mt-2">
              {new Date(item.created_at).toLocaleString()}
            </p>
          </div>
        ))}

      </div>
    </div>
  )
}