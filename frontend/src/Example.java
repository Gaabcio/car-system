import javax.swing.*;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;

public class Example extends JFrame{
    private JPanel JPanel1;
    private JTextField textFieldA;
    private JTextField textFieldB;
    private JButton sumaButton;
    private JButton roznicaButton;
    private JButton iloczynButton;
    private JButton ilorazButton;
    private JButton wyczyscButton;
    private JButton wyjscieButton;
    private JLabel lableWynik;
    private int width = 400, height = 400;

    private double valueA, valueB, score;

    public static void main(String[] args) {
        Example example = new Example();
        example.setVisible(true);
    }

    public Example(){
        super("Kalkulator");
        this.setContentPane(this.JPanel1);
        this.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        this.setSize(width,height);
        //this.pack();


        wyjscieButton.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                dispose();
            }
        });


        wyczyscButton.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                textFieldA.setText("");
                textFieldB.setText("");
                lableWynik.setText("Tu pojawi się wynik działania");
            }
        });


        sumaButton.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                valueA = Double.parseDouble(textFieldA.getText());
                valueB = Double.parseDouble(textFieldB.getText());
                score = valueA + valueB;
                lableWynik.setText("Suma "+ String.valueOf(valueA)+" + "+
                        String.valueOf(valueB) + " = "+ String.valueOf(score));
            }
        });
        roznicaButton.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                valueA = Double.parseDouble(textFieldA.getText());
                valueB = Double.parseDouble(textFieldB.getText());
                score = valueA - valueB;
                lableWynik.setText("Różnica "+ String.valueOf(valueA)+" - "+
                        String.valueOf(valueB) + " = "+ String.valueOf(score));
            }
        });
        ilorazButton.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                //gdy bedzie blad Iopcionpane
            }
        });
    }


}
