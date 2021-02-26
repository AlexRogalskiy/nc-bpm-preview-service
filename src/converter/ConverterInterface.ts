import { Response } from "express";

export interface ConverterInterface {
    getSupportedMimetypes(): string[]
    convert(content: string, filetype: string, res: Response): void
}