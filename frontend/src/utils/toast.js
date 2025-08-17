class ToastManager {
  show({ title, status = 'info', duration = 3000, isClosable = true, position = 'top' }) {
    const toast = document.createElement('div');
    toast.className = `fixed z-50 p-4 rounded-lg shadow-lg max-w-md ${this.getPositionClasses(position)} ${this.getStatusClasses(status)}`;

    const content = document.createElement('div');
    content.className = 'flex items-center justify-between';

    const message = document.createElement('span');
    message.textContent = title;
    message.className = 'font-medium';

    content.appendChild(message);

    if (isClosable) {
      const closeBtn = document.createElement('button');
      closeBtn.innerHTML = '×';
      closeBtn.className = 'ml-4 text-xl font-bold opacity-70 hover:opacity-100 transition-opacity';
      closeBtn.onclick = () => this.removeToast(toast);
      content.appendChild(closeBtn);
    }

    toast.appendChild(content);
    document.body.appendChild(toast);

    setTimeout(() => {
      toast.style.transform = 'translateY(0)';
      toast.style.opacity = '1';
    }, 10);

    if (duration > 0) {
      setTimeout(() => {
        this.removeToast(toast);
      }, duration);
    }

    return toast;
  }

  getPositionClasses(position) {
    switch (position) {
      case 'top':
        return 'top-4 left-1/2 transform -translate-x-1/2 -translate-y-4 opacity-0 transition-all duration-300';
      case 'bottom':
        return 'bottom-4 left-1/2 transform -translate-x-1/2 translate-y-4 opacity-0 transition-all duration-300';
      case 'top-left':
        return 'top-4 left-4 -translate-y-4 opacity-0 transition-all duration-300';
      case 'top-right':
        return 'top-4 right-4 -translate-y-4 opacity-0 transition-all duration-300';
      case 'bottom-left':
        return 'bottom-4 left-4 translate-y-4 opacity-0 transition-all duration-300';
      case 'bottom-right':
        return 'bottom-4 right-4 translate-y-4 opacity-0 transition-all duration-300';
      default:
        return 'top-4 left-1/2 transform -translate-x-1/2 -translate-y-4 opacity-0 transition-all duration-300';
    }
  }

  getStatusClasses(status) {
    switch (status) {
      case 'success':
        return 'bg-green-500 text-white';
      case 'error':
        return 'bg-red-500 text-white';
      case 'warning':
        return 'bg-yellow-500 text-white';
      case 'info':
      default:
        return 'bg-blue-500 text-white';
    }
  }

  removeToast(toast) {
    if (toast && toast.parentNode) {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(-20px)';
      setTimeout(() => {
        if (toast.parentNode) {
          toast.parentNode.removeChild(toast);
        }
      }, 300);
    }
  }
}

export const toast = new ToastManager();
