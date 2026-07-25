using System;
using System.IO;
using System.Net;
using System.Text;
using System.Diagnostics;
using System.Reflection;
using System.Threading;

class Program {
    static string GetEmbeddedFile(string name) {
        var assembly = Assembly.GetExecutingAssembly();
        var resourceName = "SamuelProblemTheorem." + name;
        using (Stream stream = assembly.GetManifestResourceStream(resourceName)) {
            if (stream == null) return "";
            using (StreamReader reader = new StreamReader(stream)) {
                return reader.ReadToEnd();
            }
        }
    }

    static void Main(string[] args) {
        int port = 3000;
        HttpListener listener = new HttpListener();
        
        try {
            listener.Prefixes.Add("http://localhost:" + port + "/");
            listener.Start();
        } catch (Exception ex) {
            Console.WriteLine("Port " + port + " is busy: " + ex.Message);
            port = 3050;
            listener = new HttpListener();
            listener.Prefixes.Add("http://localhost:" + port + "/");
            try {
                listener.Start();
            } catch (Exception ex2) {
                Console.WriteLine("Failed to start on port " + port + ": " + ex2.Message);
                Console.WriteLine("Press Enter to exit...");
                Console.ReadLine();
                return;
            }
        }

        try {
            Console.Title = "Samuel's Problem Theorem Application Server";
            Console.Clear();
            Console.ForegroundColor = ConsoleColor.Cyan;
        } catch {}
        Console.WriteLine("==============================================================");
        Console.WriteLine("        SAMUEL'S PROBLEM THEOREM APPLICATION SERVER");
        Console.WriteLine("==============================================================");
        try {
            Console.ResetColor();
        } catch {}
        Console.WriteLine(" Server berhasil dijalankan!");
        Console.WriteLine(" Silakan akses aplikasi melalui peramban (browser) di:");
        try {
            Console.ForegroundColor = ConsoleColor.Green;
        } catch {}
        Console.WriteLine(" --> http://localhost:" + port + "/");
        try {
            Console.ResetColor();
        } catch {}
        Console.WriteLine("==============================================================");
        Console.WriteLine(" Membuka peramban otomatis...");
        
        try {
            Process.Start("http://localhost:" + port + "/");
        } catch {
            try {
                Process.Start("cmd", "/c start http://localhost:" + port + "/");
            } catch {}
        }

        ThreadPool.QueueUserWorkItem((o) => {
            while (listener.IsListening) {
                try {
                    HttpListenerContext context = listener.GetContext();
                    HttpListenerRequest request = context.Request;
                    HttpListenerResponse response = context.Response;

                    string path = request.Url.LocalPath.TrimStart('/');
                    if (string.IsNullOrEmpty(path)) path = "index.html";

                    byte[] buffer = null;
                    string contentType = "text/html";

                    path = Uri.UnescapeDataString(path);

                    if (path == "index.html") {
                        buffer = Encoding.UTF8.GetBytes(GetEmbeddedFile("index.html"));
                        contentType = "text/html; charset=utf-8";
                    } else if (path == "app.js") {
                        buffer = Encoding.UTF8.GetBytes(GetEmbeddedFile("app.js"));
                        contentType = "application/javascript";
                    } else if (path == "style.css") {
                        buffer = Encoding.UTF8.GetBytes(GetEmbeddedFile("style.css"));
                        contentType = "text/css";
                    } else {
                        if (File.Exists(path)) {
                            buffer = File.ReadAllBytes(path);
                            if (path.EndsWith(".pdf", StringComparison.OrdinalIgnoreCase)) contentType = "application/pdf";
                            else if (path.EndsWith(".docx", StringComparison.OrdinalIgnoreCase)) contentType = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
                            else if (path.EndsWith(".png", StringComparison.OrdinalIgnoreCase)) contentType = "image/png";
                            else if (path.EndsWith(".jpg", StringComparison.OrdinalIgnoreCase) || path.EndsWith(".jpeg", StringComparison.OrdinalIgnoreCase)) contentType = "image/jpeg";
                            else contentType = "application/octet-stream";
                        }
                    }

                    if (buffer != null) {
                        response.ContentType = contentType;
                        response.ContentLength64 = buffer.Length;
                        response.OutputStream.Write(buffer, 0, buffer.Length);
                    } else {
                        response.StatusCode = 404;
                    }
                    response.OutputStream.Close();
                } catch {}
            }
        });

        Console.WriteLine("\n [Petunjuk] Tekan tombol ENTER pada jendela ini untuk mematikan server...");
        try {
            string input = Console.ReadLine();
            if (input == null) {
                while (listener.IsListening) {
                    Thread.Sleep(5000);
                }
            }
        } catch {
            while (listener.IsListening) {
                Thread.Sleep(5000);
            }
        }
        listener.Stop();
    }
}
