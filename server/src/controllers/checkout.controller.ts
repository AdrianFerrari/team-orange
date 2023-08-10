import { Action, ApiController, Controller, HttpMethod } from "@miracledevs/paradigm-express-webapi";
import { UserInterface } from "../models/user";
import { JWTAuthFilter } from "../filters/jwtAuth";
import { ProductSaleArrayFilter } from "../filters/product.filter";
import { Path, POST, GET } from "typescript-rest";
import { InvoiceRepository } from "../repositories/invoice.repository";
import { ItemRepository } from "../repositories/item.repository";
import { InvoiceViewRepository } from "../repositories/invoiceView.repository";
import { Tags, Response } from "typescript-rest-swagger";
import { InvoiceViewInterface } from "../models/invoiceView";
import sendEmail from "../utils/sendEmail";
import { ProductSaleInterface } from "../models/product";
import dotenv from "dotenv";
dotenv.config();

@Path("/api/checkout")
@Tags("Cart")
@Controller({ route: "/api/checkout" })
export class CheckoutController extends ApiController {
    constructor(private invoiceRepo: InvoiceRepository, private itemRepo: ItemRepository, private invoiceViewRepo: InvoiceViewRepository) {
        super();
    }

    @GET
    @Path("/get")
    @Response<InvoiceViewInterface[]>(200, "Retrieve an invoice.")
    @Response(404, "Invoice not found.")
    @Response(500, "Server error.")
    @Action({ route: "/get", method: HttpMethod.GET, filters: [JWTAuthFilter], fromBody: true })
    async getInvoice() {
        const { id } = this.httpContext.request.body.decodedToken;
        const invoiceView = await this.invoiceViewRepo.find({ userId: id });
        if (invoiceView.length === 0) throw new Error("No Invoice found");
        return invoiceView;
    }

    @POST
    @Path("/produce")
    @Action({ route: "/produce", method: HttpMethod.POST, filters: [ProductSaleArrayFilter, JWTAuthFilter], fromBody: true })
    async produceInvoice({ entity, decodedToken }: { entity: ProductSaleInterface[]; decodedToken: UserInterface }) {
        if (entity.length === 0) throw new Error("No items in cart");
        const date = new Date();
        const grandTotal = [...entity].reduce((acc, c) => acc + c.price * c.discountPercentage * c.quantity, 0);
        const invoice = await this.invoiceRepo.insertOne({ userId: decodedToken.id, date: date, total: grandTotal });
        const items = entity.map(item => ({
            invoiceId: invoice.insertId,
            productId: item.id,
            unitPrice: item.price,
            quantity: item.quantity,
            total: item.price * item.discountPercentage * item.quantity,
        }));
        await this.itemRepo.insertItem(items);
        const invoiceView = await this.invoiceViewRepo.getById(invoice.insertId);
        const urlInfo = await sendEmail(invoiceView);
        return { ...invoiceView, messageUrl: urlInfo };
    }
}
