
import  LogoutButton  from "@/components/LogoutButton"

export default function Home() {

  return (
    <div className="flex flex-col items-center justify-center h-screen">

        <h1 className="text-4xl font-semibold"> Welcome to EchoChat AI</h1>
          <div className="mt-6">
              <LogoutButton/>
          </div>
    </div>
  )


}