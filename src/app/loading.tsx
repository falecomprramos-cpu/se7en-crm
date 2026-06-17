export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center">
        <div className="h-2 w-32 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-600 mb-4 animate-pulse" />
        <p className="text-muted-foreground">Carregando...</p>
      </div>
    </div>
  )
}
