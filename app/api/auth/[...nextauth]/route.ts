import { getUser } from "@/lib/data";
import { User } from "@/lib/types";
import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"


declare module "next-auth" {
    interface Session {
      user: {
        id?: string;
        name?: string | null;
        email?: string | null;
        image?: string | null;
      }
    }
  
    interface JWT {
      id?: string;
    }
  }

const handler = NextAuth({
    // Configure one or more authentication providers
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_ID as string,
            clientSecret: process.env.GOOGLE_SECRET as string,
        }),
    ],
    callbacks: {
        async session({ session, token }) {
          // Agregar el user.id a la sesión
          if (token.id) {
            session.user.id = token.id as string;  // Asegurarse de que token.id esté definido
            // session.user.data = await getUser(token.id as string) as User;
          }
          return session;
        },
        async jwt({ token, user }) {
          if (user) {
            token.id = user.id.toString();  // Asegúrate de convertirlo a string si es necesario
          }
          return token;
        }
      }
    
    // A database is optional, but required to persist accounts in a database
    // database: process.env.DATABASE_URL,
})

export { handler as GET, handler as POST }