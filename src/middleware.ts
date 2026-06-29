import { updateSession } from "@/lib/supabase/middleware"
import { NextResponse, type NextRequest } from "next/server"


export async function middleware(request: NextRequest) {


const response = await updateSession(request)



const pathname = request.nextUrl.pathname



const supabaseUser = request.cookies.get(
"sb-access-token"
)



// Se tentar entrar no dashboard sem login

if(
pathname.startsWith("/dashboard") &&
!supabaseUser
){

return NextResponse.redirect(
new URL("/login", request.url)
)

}



// Se tentar entrar na área cliente sem login

if(
pathname.startsWith("/cliente/dashboard") &&
!supabaseUser
){

return NextResponse.redirect(
new URL("/cliente/login", request.url)
)

}



return response

}



export const config = {

matcher:[

"/dashboard/:path*",

"/cliente/:path*"

]

}