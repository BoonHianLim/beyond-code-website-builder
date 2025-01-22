export type InternalGenerateWebsiteReq = {
    fileName: string,
    options: unknown
}

export interface Adapter {
	GenerateWebsite: (req: InternalGenerateWebsiteReq) => Promise<string>
}