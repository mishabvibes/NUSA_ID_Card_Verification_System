"use client"

import { CSVUploadForm } from "@/components/student/csv-upload-form"

export default function UploadPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">CSV Upload</h1>
        <p className="mt-1 text-sm text-gray-500">Upload student data using a CSV file</p>
      </div>

      <CSVUploadForm />

      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-medium">CSV Format Instructions</h2>
        <p className="mb-4 text-sm text-gray-500">The CSV file should have the following columns:</p>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                >
                  Column
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                >
                  Description
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                >
                  Example
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              <tr>
                <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">T.No</td>
                <td className="px-6 py-4 text-sm text-gray-500">Token Number (unique identifier)</td>
                <td className="px-6 py-4 text-sm text-gray-500">676</td>
              </tr>
              <tr>
                <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">Name</td>
                <td className="px-6 py-4 text-sm text-gray-500">Student's full name</td>
                <td className="px-6 py-4 text-sm text-gray-500">MOHAMED RIYAS TK</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="mt-6">
          <h3 className="mb-2 text-sm font-medium text-gray-700">Sample CSV:</h3>
          <pre className="rounded-md bg-gray-100 p-3 text-xs">
            T.No,Name
            <br />
            676,MOHAMED RIYAS TK
            <br />
            677,MUHAMMED RASHID KP
          </pre>
        </div>

        <div className="mt-6">
          <h3 className="mb-2 text-sm font-medium text-gray-700">Notes:</h3>
          <ul className="list-inside list-disc space-y-1 text-sm text-gray-500">
            <li>The first row should contain the column headers.</li>
            <li>Token numbers must be unique.</li>
            <li>Photos should be uploaded separately and named according to the token number (e.g., 676.jpg).</li>
            <li>If "Overwrite existing students" is checked, existing records will be updated.</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
