import type { FileCellData } from "@/shared/lib/data-grid";

/** Simulate a file upload by mapping `File` objects to `FileCellData` entries. */
export function mockFilesUpload(params: {
  files: File[];
  rowIndex: number;
  columnId: string;
}): Promise<FileCellData[]> {
  return Promise.resolve(
    params.files.map((file, i) => ({
      id: `upload-${Date.now()}-${i}`,
      name: file.name,
      size: file.size,
      type: file.type,
    }))
  );
}
