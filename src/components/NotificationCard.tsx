export type NotificationCardProps = {
  message: string | null; 
  error: boolean;
  openModal: boolean;
}

export const NotificationCard: React.FunctionComponent<NotificationCardProps> = (props: NotificationCardProps) => {
  const {message, error, openModal} = props;
  const open = "visible absolute top-4 right-5 min-w-1/5 text-center animate-fade-in-scale";
  const close = "invisible";

  return (
    <div aria-modal='true' className={openModal ? open : close}>
      {error ? <p className="bg-red-500 text-white p-2 rounded">{message || "Une erreur est survenue."}</p>
      : <p className="bg-sky-500 text-sky-50 p-2 rounded">{message}</p>
      }
    </div>
  )
}