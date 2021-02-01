import 'egg';
import { Application } from 'egg';

declare module 'egg' {
    interface Application extends Application {
        oidcProvider:any
    }
}