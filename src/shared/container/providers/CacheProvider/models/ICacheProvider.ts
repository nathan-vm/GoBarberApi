export default interface ICacheProvider {
  save(key: string, value: any): Promise<void>
  recover<Type>(key: string): Promise<Type | null>
  invalidate(key: string): Promise<void>
  invalidatePrefix(prefix: string): Promise<void>
}
