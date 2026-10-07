import atlantafx.base.theme.PrimerLight;
import com.gorkha.gorkhajewellery.GorkhaJewelleryApplication;
import com.gorkha.gorkhajewellery.model.InvoiceItem;
import javafx.application.Application;
import javafx.application.Platform;
import javafx.fxml.FXMLLoader;
import javafx.scene.Parent;
import javafx.scene.Scene;
import javafx.scene.SnapshotParameters;
import javafx.scene.control.TableView;
import javafx.scene.control.TextField;
import javafx.scene.image.WritableImage;
import javafx.scene.transform.Transform;
import javafx.stage.Stage;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.context.ConfigurableApplicationContext;

import javax.imageio.ImageIO;
import java.io.File;

/* Renders the real invoice screen with a sample invoice filled in, straight to
   PNG. Sample figures only. */
public class Snap extends Application {
    private ConfigurableApplicationContext ctx;

    public static void main(String[] a) { launch(Snap.class, a); }

    @Override public void init() {
        ctx = new SpringApplicationBuilder(GorkhaJewelleryApplication.class)
            .properties("spring.datasource.url=jdbc:h2:mem:snap", "spring.main.web-application-type=none")
            .run();
    }

    @Override public void start(Stage stage) throws Exception {
        Application.setUserAgentStylesheet(new PrimerLight().getUserAgentStylesheet());
        FXMLLoader l = new FXMLLoader(GorkhaJewelleryApplication.class.getResource("/fxml/main.fxml"));
        l.setControllerFactory(ctx::getBean);
        Parent root = l.load();
        root.getStylesheets().add(GorkhaJewelleryApplication.class.getResource("/css/styles.css").toExternalForm());
        Scene scene = new Scene(root, 1360, 820);
        stage.setScene(scene);
        stage.setX(-6000); stage.setY(-6000);
        stage.show();

        set(root, "#customerNameField", "Sita Tamang");
        set(root, "#phoneField", "0400 000 000");
        set(root, "#customerAddressField", "Harris Park NSW 2150");
        set(root, "#rate22kField", "1880");
        set(root, "#rate24kField", "2050");
        set(root, "#rateSilverField", "24");

        @SuppressWarnings("unchecked")
        TableView<InvoiceItem> t = (TableView<InvoiceItem>) root.lookup("#itemTable");
        t.getItems().clear();
        t.getItems().add(item("Tilhari pendant", "24K", "Lal", 58, 4, 180, 0));
        t.getItems().add(item("Bangles (pair)", "22K", "Tola", 2.5, 0.08, 420, 0));
        t.getItems().add(item("Ruby stud earrings", "22K", "Lal", 32, 3, 150, 260));
        t.getItems().add(item("Silver anklets", "Silver", "Tola", 6, 0, 60, 0));
        set(root, "#discountField", "50");
        set(root, "#gstField", "10");
        set(root, "#advanceField", "1000");

        Platform.runLater(() -> Platform.runLater(() -> {
            try {
                SnapshotParameters p = new SnapshotParameters();
                p.setTransform(Transform.scale(2, 2));
                WritableImage img = root.snapshot(p, null);
                ImageIO.write(toAwt(img), "png", new File(System.getProperty("out", "gorkha.png")));
                System.out.println("wrote");
            } catch (Exception e) { e.printStackTrace(); }
            Platform.exit(); ctx.close(); System.exit(0);
        }));
    }

    private static java.awt.image.BufferedImage toAwt(WritableImage img) {
        int w = (int) img.getWidth(), h = (int) img.getHeight();
        var out = new java.awt.image.BufferedImage(w, h, java.awt.image.BufferedImage.TYPE_INT_ARGB);
        var r = img.getPixelReader();
        for (int y = 0; y < h; y++) for (int x = 0; x < w; x++) out.setRGB(x, y, r.getArgb(x, y));
        return out;
    }

    private static void set(Parent r, String id, String v) {
        var n = r.lookup(id);
        if (n instanceof TextField f) { f.setText(""); f.setText(v); }
    }

    private static InvoiceItem item(String d, String p, String unit, double net, double wastage, double wages, double stone) {
        InvoiceItem i = new InvoiceItem();
        i.setDescription(d); i.setPurity(p); i.setWeightUnit(unit); i.setWastageUnit(unit);
        i.setNetWeightLal(net); i.setWastageLal(wastage); i.setWages(wages); i.setStoneCost(stone);
        i.calculateLineTotal(1880, 2050, 24);
        return i;
    }
}
