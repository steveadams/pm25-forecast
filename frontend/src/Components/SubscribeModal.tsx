import { Dispatch, FC, Fragment, SetStateAction, useRef } from 'react';
import { Dialog, Transition } from '@headlessui/react';

const SubscribeModal: FC<{
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}> = ({ open, setOpen }) => {
  const cancelButtonRef = useRef(null);

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-10"
        initialFocus={cancelButtonRef}
        onClose={setOpen}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 py-12 text-left shadow-xl transition-all w-full max-w-3xl md:px-12 md:py-16 mx-4">
                {/* Add a background image */}
                <img
                  className="absolute inset-0 h-full w-full object-cover"
                  src="https://images.unsplash.com/photo-1476231682828-37e571bc172f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80"
                  alt=""
                />

                {/* Dim the background image to make the text more readable */}
                <div className="absolute inset-0 bg-gray-900/70" />

                {/* Content here */}
                <div className="relative mx-auto w-full">
                  <h2 className="mx-auto text-center text-3xl font-black tracking-tight text-white sm:text-4xl">
                    Get notified when smoke is coming.
                  </h2>
                  <p className="mx-auto mt-2 text-center text-lg leading-8 text-white">
                    We'll only send you email when the forecast warrants it.
                  </p>

                  <form className="mx-auto mt-10 flex max-w-md gap-x-4">
                    <label htmlFor="email-address" className="sr-only">
                      Email address
                    </label>
                    <input
                      id="email-address"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      autoFocus={false}
                      className="min-w-0 flex-auto rounded-md border-0 font-semibold bg-white/10 px-3.5 py-2 text-white shadow-sm ring-2 ring-inset ring-white/50 focus:ring-3 focus:ring-inset focus:ring-white focus:bg-white/20 sm:leading-6 placeholder:text-white/80"
                      placeholder="Enter your email"
                    />
                    <button
                      type="submit"
                      className="flex-none rounded-md bg-white px-3 py-2 font-bold text-gray-900 shadow-sm hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                    >
                      Notify me
                    </button>
                  </form>
                  <svg
                    viewBox="0 0 1024 1024"
                    className="absolute left-1/2 top-1/2 -z-10 h-[64rem] w-[64rem] -translate-x-1/2"
                    aria-hidden="true"
                  >
                    <circle
                      cx={512}
                      cy={512}
                      r={512}
                      fill="url(#759c1415-0410-454c-8f7c-9a820de03641)"
                      fillOpacity="0.5"
                    />
                    <defs>
                      <radialGradient
                        id="759c1415-0410-454c-8f7c-9a820de03641"
                        cx={0}
                        cy={0}
                        r={1}
                        gradientUnits="userSpaceOnUse"
                        gradientTransform="translate(512 512) rotate(90) scale(512)"
                      >
                        <stop stopColor="#fff" />
                        <stop offset={1} stopColor="#E935C1" stopOpacity={0} />
                      </radialGradient>
                    </defs>
                  </svg>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export { SubscribeModal };
