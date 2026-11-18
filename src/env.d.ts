declare namespace App {
  interface Locals {
    identity?: import('./server/auth/access.ts').Identity;
  }
}
