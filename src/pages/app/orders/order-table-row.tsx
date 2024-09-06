import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { TableCell, TableRow } from "@/components/ui/table";
import { ArrowRight, Search, X } from "lucide-react";
import OrderDetail from "./order-details";
import { OrderStatus } from "@/components/order-status.tsx";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { cancelOrder } from "@/api/cancel-order.ts";
import { GetOrdersResponse } from "@/api/get-orders.ts";

export interface OrderTableRowProps {
  order: {
    orderId: string;
    createdAt: string;
    status: "pending" | "canceled" | "processing" | "delivering" | "delivered";
    customerName: string;
    total: number;
  };
}

export function OrderTableRow({ order }: OrderTableRowProps) {
  const [isDetailsOpen, setIsDetaislOpen] = useState(false);
  const queryclient = useQueryClient();

  // Vai percorrer todas as listas de pedidos que eu tenho carregadas, filtradas, paginadas (em cache)
  // Quando ele encontrar o id do pedido que é igual ao que eu passei, ele vai cancelar o pedido.
  // Ele não vai apagar o cache, o arquivo ainda vai carregar instantâneo
  const { mutateAsync: cancelOrderFn } = useMutation({
    mutationFn: cancelOrder,
    //     Alterar o cache para retornar uma resposta do cancelamento do pedido
    // Não precisa de interface otimista (alterar visualmente para o usuário e se der erro voltar atrás depois de 5 seg)
    onSuccess(_, { orderId }) {
      const ordersListCache = queryclient.getQueriesData<GetOrdersResponse>({
        queryKey: ["orders"],
      });

      ordersListCache.forEach(([cacheKey, cacheData]) => {
        if (!cacheData) {
          return;
        }

        queryclient.setQueryData<GetOrdersResponse>(cacheKey, {
          ...cacheData,
          orders: cacheData.orders.map((order) => {
            if (order.orderId == orderId) {
              return { ...order, status: "canceled" };
            }

            return order;
          }),
        });
      });
    },
  });

  return (
    <TableRow>
      <TableCell>
        <Dialog open={isDetailsOpen} onOpenChange={setIsDetaislOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="xs">
              <Search className="h-3 w-3" />
              <span className="sr-only">Detalhes do Pedido</span>
            </Button>
          </DialogTrigger>
          <OrderDetail open={isDetailsOpen} orderId={order.orderId} />
        </Dialog>
      </TableCell>
      <TableCell className="font-mono text-sm font-medium">
        {order.orderId}
      </TableCell>
      <TableCell className="text-muted-foreground">
        {formatDistanceToNow(order.createdAt, {
          locale: ptBR,
          addSuffix: true,
        })}
      </TableCell>
      <TableCell>
        <OrderStatus status={order.status} />
      </TableCell>
      <TableCell className="font-medium">{order.customerName}</TableCell>
      <TableCell className="font-medium">
        {(order.total / 100).toLocaleString("pt-Br", {
          style: "currency",
          currency: "BRL",
        })}
      </TableCell>
      <TableCell>
        <Button variant="outline" size="xs">
          <ArrowRight className="mr-2 h-3 w-3" />
          Aprovar
        </Button>
      </TableCell>
      <TableCell>
        <Button
          disabled={!["pending", "processing"].includes(order.status)} // Desativa quando não é pending ou processing
          onClick={() => cancelOrderFn({ orderId: order.orderId })} // Muda o status para cancelado quando clico
          variant="ghost"
          size="xs"
        >
          <X className="mr-2 h-3 w-3" />
          Cancelar
        </Button>
      </TableCell>
    </TableRow>
  );
}
